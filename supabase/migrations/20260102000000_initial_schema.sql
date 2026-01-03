-- =============================================
-- LAUFBLOCKS V2 - Initial Database Schema
-- =============================================

-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

-- Profiles extend Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SUBSCRIPTIONS
-- =============================================

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM (
    'active', 'canceled', 'past_due', 'trialing', 'incomplete'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('free', 'pro');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  tier subscription_tier DEFAULT 'free' NOT NULL,
  status subscription_status DEFAULT 'active' NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BLOCKS
-- =============================================

DO $$ BEGIN
  CREATE TYPE block_category AS ENUM (
    'hero', 'navbar', 'footer', 'features', 'pricing',
    'testimonials', 'cta', 'faq', 'contact', 'logos',
    'stats', 'blog', 'ecommerce', 'auth', 'forms'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE block_tier AS ENUM ('free', 'pro');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category block_category NOT NULL,
  tier block_tier DEFAULT 'free' NOT NULL,
  preview_image_url TEXT,
  source_code TEXT NOT NULL,
  props_interface TEXT,
  dependencies JSONB DEFAULT '[]'::JSONB,
  seo_schema JSONB,
  is_published BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  copy_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Block variants for the Style Visualizer
DO $$ BEGIN
  CREATE TYPE block_style AS ENUM (
    'minimalist', 'high_brand', 'neo_industrial'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.block_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  block_id UUID REFERENCES public.blocks(id) ON DELETE CASCADE NOT NULL,
  style block_style NOT NULL,
  source_code TEXT NOT NULL,
  tailwind_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(block_id, style)
);

-- =============================================
-- AI GENERATIONS
-- =============================================

CREATE TABLE IF NOT EXISTS public.site_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  prompt TEXT NOT NULL,
  sitemap JSONB NOT NULL,
  selected_blocks JSONB NOT NULL,
  is_exported BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track monthly generation limits for free users
CREATE TABLE IF NOT EXISTS public.generation_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  month_year TEXT NOT NULL,
  generation_count INTEGER DEFAULT 0,
  UNIQUE(user_id, month_year)
);

-- =============================================
-- ANALYTICS
-- =============================================

CREATE TABLE IF NOT EXISTS public.block_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  block_id UUID REFERENCES public.blocks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.block_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.block_analytics ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Subscriptions: Users can view their own subscription
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Blocks: Published blocks are viewable by everyone
DROP POLICY IF EXISTS "Anyone can view published blocks" ON public.blocks;
CREATE POLICY "Anyone can view published blocks"
  ON public.blocks FOR SELECT
  USING (is_published = TRUE);

-- Block variants: Viewable if parent block is published
DROP POLICY IF EXISTS "Anyone can view block variants" ON public.block_variants;
CREATE POLICY "Anyone can view block variants"
  ON public.block_variants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.blocks
      WHERE blocks.id = block_variants.block_id
      AND blocks.is_published = TRUE
    )
  );

-- Site generations: Users can manage their own
DROP POLICY IF EXISTS "Users can manage own generations" ON public.site_generations;
CREATE POLICY "Users can manage own generations"
  ON public.site_generations FOR ALL
  USING (auth.uid() = user_id);

-- Generation usage: Users can view their own
DROP POLICY IF EXISTS "Users can view own usage" ON public.generation_usage;
CREATE POLICY "Users can view own usage"
  ON public.generation_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Block analytics: Insert allowed for all authenticated, view own only
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.block_analytics;
CREATE POLICY "Anyone can insert analytics"
  ON public.block_analytics FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can view own analytics" ON public.block_analytics;
CREATE POLICY "Users can view own analytics"
  ON public.block_analytics FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS blocks_updated_at ON public.blocks;
CREATE TRIGGER blocks_updated_at
  BEFORE UPDATE ON public.blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Create free subscription
  INSERT INTO public.subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Increment block view/copy counts
CREATE OR REPLACE FUNCTION increment_block_stat(
  block_uuid UUID,
  stat_type TEXT
)
RETURNS VOID AS $$
BEGIN
  IF stat_type = 'view' THEN
    UPDATE public.blocks SET view_count = view_count + 1 WHERE id = block_uuid;
  ELSIF stat_type = 'copy' THEN
    UPDATE public.blocks SET copy_count = copy_count + 1 WHERE id = block_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_blocks_category ON public.blocks(category);
CREATE INDEX IF NOT EXISTS idx_blocks_tier ON public.blocks(tier);
CREATE INDEX IF NOT EXISTS idx_blocks_slug ON public.blocks(slug);
CREATE INDEX IF NOT EXISTS idx_block_variants_block_id ON public.block_variants(block_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_site_generations_user_id ON public.site_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_block_analytics_block_id ON public.block_analytics(block_id);
CREATE INDEX IF NOT EXISTS idx_block_analytics_created_at ON public.block_analytics(created_at);
