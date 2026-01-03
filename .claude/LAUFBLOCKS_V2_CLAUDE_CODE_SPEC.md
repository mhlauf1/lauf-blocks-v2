# 🧱 LaufBlocks V2 — Claude Code Master Specification

> **Single Source of Truth for Claude Code Implementation**  
> Version 2.0 | January 2026  
> Target: Next.js 15 + React 19 + Tailwind CSS 4.0

---

## 📋 Claude Code Instructions

You are building **LaufBlocks V2**, a premium React/Next.js component library and site-building ecosystem. This specification defines the complete implementation path from empty project to fully deployed full-stack application.

### MCP Server Configuration

Before starting, configure these MCP servers:

```bash
# Search and install Supabase MCP server
# Reference: https://github.com/supabase/mcp-server-supabase
claude mcp add supabase

# Search and install Playwright MCP server for UI testing
# Reference: https://github.com/executeautomation/mcp-playwright
claude mcp add playwright
```

### Execution Protocol

For each TODO item in this specification:

1. **Deploy a separate task sub-agent** for the implementation
2. **After each task completion**, run:
   - `npm run build` — Verify build passes
   - `npm run test:e2e` — Run Playwright UI tests
3. **Iterate** until the task passes all checks
4. **Mark task complete** and proceed to next item

---

## 🎯 Project Overview

### Core Value Proposition

| Attribute                | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| **React/Next.js Native** | Built for App Router, React 19+, Server Components   |
| **Developer Ownership**  | Shadcn UI philosophy — copy-paste, don't install     |
| **Performance**          | 100% Lighthouse scores by default, zero bundle bloat |
| **Affordability**        | $19.99/mo Pro plan (undercutting Relume's $40/mo)    |

### Tech Stack

```yaml
Framework: Next.js 15 (App Router)
Language: TypeScript 5.x (Strict Mode)
Styling: Tailwind CSS 4.0
UI Primitives: Radix UI
Animations: Framer Motion
Icons: Lucide React
Database: Supabase (PostgreSQL + Auth)
Payments: Stripe
Testing: Playwright + Vitest
Deployment: Vercel
```

---

## 📁 Project Architecture

```
laufblocks/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts
│   ├── (marketing)/
│   │   ├── page.tsx                    # Landing page
│   │   ├── pricing/page.tsx
│   │   └── changelog/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Protected layout
│   │   ├── dashboard/page.tsx
│   │   ├── blocks/
│   │   │   ├── page.tsx                # Block library browser
│   │   │   └── [category]/page.tsx
│   │   ├── generator/page.tsx          # AI Site Generator
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── webhooks/stripe/route.ts
│   │   ├── generate/route.ts           # AI generation endpoint
│   │   └── blocks/[id]/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                             # Shadcn-style base components
│   ├── blocks/                         # The actual Lauf Blocks
│   │   ├── heroes/
│   │   ├── navbars/
│   │   ├── footers/
│   │   ├── features/
│   │   ├── pricing/
│   │   ├── testimonials/
│   │   ├── cta/
│   │   ├── faq/
│   │   ├── contact/
│   │   ├── logos/
│   │   ├── stats/
│   │   └── blog/
│   ├── marketplace/                    # Marketplace-specific UI
│   │   ├── block-card.tsx
│   │   ├── block-preview.tsx
│   │   ├── style-visualizer.tsx
│   │   ├── code-viewer.tsx
│   │   └── copy-button.tsx
│   └── shared/                         # Shared components
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── middleware.ts
│   │   └── types.ts
│   ├── stripe/
│   │   ├── client.ts
│   │   └── webhook-handlers.ts
│   ├── blocks/
│   │   ├── registry.ts                 # Block metadata registry
│   │   ├── loader.ts                   # Dynamic block loading
│   │   └── themes.ts                   # Theme configurations
│   ├── ai/
│   │   ├── sitemap-generator.ts
│   │   └── block-mapper.ts
│   └── utils/
│       ├── cn.ts                       # Class name utility
│       └── copy-to-clipboard.ts
├── hooks/
│   ├── use-theme.ts
│   ├── use-copy.ts
│   └── use-subscription.ts
├── types/
│   ├── block.ts
│   ├── user.ts
│   └── subscription.ts
├── tests/
│   ├── e2e/
│   │   ├── auth.spec.ts
│   │   ├── blocks.spec.ts
│   │   ├── checkout.spec.ts
│   │   └── generator.spec.ts
│   └── unit/
├── public/
│   ├── blocks/                         # Block preview images
│   └── og/                             # OpenGraph images
├── supabase/
│   └── migrations/                     # Database migrations
├── .env.local.example
├── tailwind.config.ts
├── next.config.ts
├── playwright.config.ts
├── vitest.config.ts
└── package.json
```

---

## 🗃️ Database Schema (Supabase)

```sql
-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

-- Profiles extend Supabase auth.users
CREATE TABLE public.profiles (
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

CREATE TYPE subscription_status AS ENUM (
  'active', 'canceled', 'past_due', 'trialing', 'incomplete'
);

CREATE TYPE subscription_tier AS ENUM ('free', 'pro');

CREATE TABLE public.subscriptions (
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

CREATE TYPE block_category AS ENUM (
  'hero', 'navbar', 'footer', 'features', 'pricing',
  'testimonials', 'cta', 'faq', 'contact', 'logos',
  'stats', 'blog', 'ecommerce', 'auth', 'forms'
);

CREATE TYPE block_tier AS ENUM ('free', 'pro');

CREATE TABLE public.blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category block_category NOT NULL,
  tier block_tier DEFAULT 'free' NOT NULL,
  preview_image_url TEXT,
  source_code TEXT NOT NULL,
  props_interface TEXT,                    -- TypeScript interface as string
  dependencies JSONB DEFAULT '[]'::JSONB,  -- Required npm packages
  seo_schema JSONB,                         -- JSON-LD schema if applicable
  is_published BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  copy_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Block variants for the Style Visualizer
CREATE TYPE block_style AS ENUM (
  'minimalist', 'high_brand', 'neo_industrial'
);

CREATE TABLE public.block_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  block_id UUID REFERENCES public.blocks(id) ON DELETE CASCADE NOT NULL,
  style block_style NOT NULL,
  source_code TEXT NOT NULL,
  tailwind_config JSONB,                   -- Style-specific Tailwind vars
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(block_id, style)
);

-- =============================================
-- AI GENERATIONS
-- =============================================

CREATE TABLE public.site_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  prompt TEXT NOT NULL,
  sitemap JSONB NOT NULL,                  -- Generated sitemap structure
  selected_blocks JSONB NOT NULL,          -- Array of block IDs per page
  is_exported BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track monthly generation limits for free users
CREATE TABLE public.generation_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  month_year TEXT NOT NULL,                -- Format: "2026-01"
  generation_count INTEGER DEFAULT 0,
  UNIQUE(user_id, month_year)
);

-- =============================================
-- ANALYTICS
-- =============================================

CREATE TABLE public.block_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  block_id UUID REFERENCES public.blocks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,                    -- 'view', 'copy_code', 'copy_cli'
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
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Subscriptions: Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Blocks: Published blocks are viewable by everyone
CREATE POLICY "Anyone can view published blocks"
  ON public.blocks FOR SELECT
  USING (is_published = TRUE);

-- Block variants: Viewable if parent block is published
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
CREATE POLICY "Users can manage own generations"
  ON public.site_generations FOR ALL
  USING (auth.uid() = user_id);

-- Generation usage: Users can view their own
CREATE POLICY "Users can view own usage"
  ON public.generation_usage FOR SELECT
  USING (auth.uid() = user_id);

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

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

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

CREATE INDEX idx_blocks_category ON public.blocks(category);
CREATE INDEX idx_blocks_tier ON public.blocks(tier);
CREATE INDEX idx_blocks_slug ON public.blocks(slug);
CREATE INDEX idx_block_variants_block_id ON public.block_variants(block_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_site_generations_user_id ON public.site_generations(user_id);
CREATE INDEX idx_block_analytics_block_id ON public.block_analytics(block_id);
CREATE INDEX idx_block_analytics_created_at ON public.block_analytics(created_at);
```

---

## 🧩 The "Lauf Block" Standard

Every component must follow this structure:

### Block File Structure

```typescript
// components/blocks/heroes/hero-gradient.tsx

"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================
// TYPES
// ============================================

export interface HeroGradientProps {
  headline: string;
  subheadline: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  gradientFrom?: string;
  gradientTo?: string;
}

// ============================================
// COMPONENT
// ============================================

export function HeroGradient({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  gradientFrom = "from-primary/20",
  gradientTo = "to-secondary/20",
}: HeroGradientProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo}`}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          {subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" asChild>
            <a href={primaryCta.href}>
              {primaryCta.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>

          {secondaryCta && (
            <Button size="lg" variant="outline" asChild>
              <a href={secondaryCta.href}>{secondaryCta.label}</a>
            </Button>
          )}
        </motion.div>
      </div>

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: headline,
            description: subheadline,
          }),
        }}
      />
    </section>
  );
}

// ============================================
// DEFAULT EXPORT FOR REGISTRY
// ============================================

export default HeroGradient;
```

### Block Registry Entry

```typescript
// lib/blocks/registry.ts

import type { BlockCategory, BlockTier, BlockStyle } from "@/types/block";

export interface BlockMeta {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: BlockCategory;
  tier: BlockTier;
  previewImage: string;
  dependencies: string[];
  styles: BlockStyle[];
  seoSchema?: Record<string, unknown>;
}

export const blockRegistry: Record<string, BlockMeta> = {
  "hero-gradient": {
    id: "hero-gradient",
    slug: "hero-gradient",
    name: "Gradient Hero",
    description:
      "A bold hero section with animated gradient background and dual CTAs",
    category: "hero",
    tier: "free",
    previewImage: "/blocks/heroes/hero-gradient.png",
    dependencies: ["framer-motion", "lucide-react"],
    styles: ["minimalist", "high_brand", "neo_industrial"],
    seoSchema: {
      "@type": "WebPage",
    },
  },
  // ... more blocks
};
```

---

## 🎨 Style Visualizer System

### Theme Configurations

```typescript
// lib/blocks/themes.ts

export type ThemeStyle = "minimalist" | "high_brand" | "neo_industrial";

export interface ThemeConfig {
  name: string;
  description: string;
  cssVariables: Record<string, string>;
  tailwindExtensions: Record<string, string>;
}

export const themes: Record<ThemeStyle, ThemeConfig> = {
  minimalist: {
    name: "Minimalist",
    description: "High whitespace, thin borders, subtle typography",
    cssVariables: {
      "--primary": "240 5% 26%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "240 5% 96%",
      "--secondary-foreground": "240 5% 26%",
      "--accent": "240 5% 90%",
      "--accent-foreground": "240 5% 26%",
      "--muted": "240 5% 96%",
      "--muted-foreground": "240 5% 46%",
      "--border": "240 5% 90%",
      "--radius": "0.375rem",
    },
    tailwindExtensions: {
      fontWeight: "300",
      borderWidth: "1px",
      letterSpacing: "0.025em",
    },
  },
  high_brand: {
    name: "High-Brand",
    description: "Bold typography, vibrant accents, gradients",
    cssVariables: {
      "--primary": "262 83% 58%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "199 89% 48%",
      "--secondary-foreground": "0 0% 100%",
      "--accent": "326 78% 60%",
      "--accent-foreground": "0 0% 100%",
      "--muted": "240 5% 96%",
      "--muted-foreground": "240 5% 46%",
      "--border": "262 83% 58%",
      "--radius": "0.75rem",
    },
    tailwindExtensions: {
      fontWeight: "700",
      borderWidth: "2px",
      letterSpacing: "-0.025em",
    },
  },
  neo_industrial: {
    name: "Neo-Industrial",
    description: "Dark mode default, thick borders, high contrast",
    cssVariables: {
      "--primary": "0 0% 100%",
      "--primary-foreground": "0 0% 0%",
      "--secondary": "0 0% 15%",
      "--secondary-foreground": "0 0% 100%",
      "--accent": "47 100% 50%",
      "--accent-foreground": "0 0% 0%",
      "--muted": "0 0% 20%",
      "--muted-foreground": "0 0% 60%",
      "--border": "0 0% 100%",
      "--radius": "0",
      "--background": "0 0% 5%",
      "--foreground": "0 0% 100%",
    },
    tailwindExtensions: {
      fontWeight: "500",
      borderWidth: "3px",
      letterSpacing: "0.05em",
    },
  },
};
```

### Style Visualizer Component

```typescript
// components/marketplace/style-visualizer.tsx

"use client";

import { useState, createContext, useContext } from "react";
import { themes, type ThemeStyle } from "@/lib/blocks/themes";

interface StyleContextValue {
  currentStyle: ThemeStyle;
  setStyle: (style: ThemeStyle) => void;
}

const StyleContext = createContext<StyleContextValue | null>(null);

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const [currentStyle, setStyle] = useState<ThemeStyle>("minimalist");

  return (
    <StyleContext.Provider value={{ currentStyle, setStyle }}>
      <div
        style={
          Object.fromEntries(
            Object.entries(themes[currentStyle].cssVariables).map(
              ([key, value]) => [key, value]
            )
          ) as React.CSSProperties
        }
      >
        {children}
      </div>
    </StyleContext.Provider>
  );
}

export function useStyle() {
  const context = useContext(StyleContext);
  if (!context) throw new Error("useStyle must be used within StyleProvider");
  return context;
}

export function StyleToggle() {
  const { currentStyle, setStyle } = useStyle();

  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
      {(Object.keys(themes) as ThemeStyle[]).map((style) => (
        <button
          key={style}
          onClick={() => setStyle(style)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            currentStyle === style
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {themes[style].name}
        </button>
      ))}
    </div>
  );
}
```

---

## 💳 Stripe Integration

### Pricing Configuration

```typescript
// lib/stripe/config.ts

export const PLANS = {
  free: {
    name: "Free",
    description: "Essential blocks for getting started",
    price: 0,
    features: [
      "50+ Essential Blocks",
      "1 Site Generation / month",
      "React Copy/Paste export",
      "Community support",
    ],
    limits: {
      blocks: "essential",
      generationsPerMonth: 1,
      exportFormats: ["copy"],
    },
  },
  pro: {
    name: "Pro",
    description: "Full access to the entire library",
    price: 1999, // $19.99 in cents
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      "1,000+ Premium Blocks",
      "Unlimited Site Generations",
      "Full Project ZIP export",
      "CLI Access (npx lauf-blocks)",
      "Priority developer support",
    ],
    limits: {
      blocks: "all",
      generationsPerMonth: Infinity,
      exportFormats: ["copy", "zip", "cli"],
    },
  },
} as const;
```

### Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;

      if (userId && subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );

        await supabase
          .from("subscriptions")
          .update({
            stripe_subscription_id: subscriptionId,
            stripe_price_id: subscription.items.data[0].price.id,
            tier: "pro",
            status: "active",
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq("user_id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile) {
        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status as any,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq("user_id", profile.id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile) {
        await supabase
          .from("subscriptions")
          .update({
            tier: "free",
            status: "canceled",
            stripe_subscription_id: null,
          })
          .eq("user_id", profile.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

---

## 🤖 AI Site Generator

### Sitemap Generation

```typescript
// lib/ai/sitemap-generator.ts

import Anthropic from "@anthropic-ai/sdk";
import { blockRegistry } from "@/lib/blocks/registry";

const anthropic = new Anthropic();

export interface SitemapPage {
  slug: string;
  title: string;
  description: string;
  sections: string[]; // Block category suggestions
}

export interface GeneratedSitemap {
  pages: SitemapPage[];
  suggestedBlocks: Record<string, string[]>; // page slug -> block IDs
}

export async function generateSitemap(
  prompt: string
): Promise<GeneratedSitemap> {
  const availableCategories = [
    ...new Set(Object.values(blockRegistry).map((b) => b.category)),
  ];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: `You are a web architecture expert. Given a project description, generate a sitemap with page structures. Available block categories: ${availableCategories.join(
      ", "
    )}.

Return JSON in this exact format:
{
  "pages": [
    {
      "slug": "home",
      "title": "Homepage",
      "description": "Main landing page",
      "sections": ["navbar", "hero", "features", "testimonials", "cta", "footer"]
    }
  ]
}`,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const sitemap = JSON.parse(content.text);

  // Map sections to actual blocks
  const suggestedBlocks: Record<string, string[]> = {};

  for (const page of sitemap.pages) {
    suggestedBlocks[page.slug] = page.sections
      .map((category: string) => {
        const matchingBlocks = Object.values(blockRegistry).filter(
          (b) => b.category === category
        );
        return matchingBlocks[0]?.id || null;
      })
      .filter(Boolean);
  }

  return {
    pages: sitemap.pages,
    suggestedBlocks,
  };
}
```

---

## ✅ Implementation TODO List

Execute each task with a separate sub-agent. After each task, run build and UI tests.

### Phase 1: Foundation (Tasks 1-15)

```markdown
[ ] TASK-001: Initialize Next.js 15 project with TypeScript strict mode - npx create-next-app@latest laufblocks --typescript --tailwind --eslint --app --src-dir=false - Configure tsconfig.json with strict: true, noUncheckedIndexedAccess: true - Set up path aliases (@/components, @/lib, @/hooks, @/types)

[ ] TASK-002: Configure Tailwind CSS 4.0 - Install tailwindcss@next @tailwindcss/postcss@next - Set up CSS variables for theming (--primary, --secondary, etc.) - Configure dark mode with class strategy - Add custom animations (fade-in, slide-up, etc.)

[ ] TASK-003: Install and configure core dependencies - Radix UI primitives (@radix-ui/react-\*) - Framer Motion - Lucide React - clsx + tailwind-merge (cn utility)

[ ] TASK-004: Set up Supabase client configuration - Install @supabase/supabase-js @supabase/ssr - Create lib/supabase/client.ts (browser client) - Create lib/supabase/server.ts (server client) - Create lib/supabase/middleware.ts (auth middleware)

[ ] TASK-005: Run Supabase migrations - Create supabase/migrations directory - Add initial schema migration (profiles, subscriptions, blocks, etc.) - Execute migrations via Supabase CLI or dashboard - Verify RLS policies are active

[ ] TASK-006: Build base UI components (Shadcn-style) - Button (variants: default, destructive, outline, secondary, ghost, link) - Input, Textarea, Label - Card (Card, CardHeader, CardContent, CardFooter) - Badge - Separator - Skeleton

[ ] TASK-007: Build navigation UI components - Sheet (mobile drawer) - DropdownMenu - NavigationMenu - Dialog / Modal - Command (command palette)

[ ] TASK-008: Build feedback UI components - Toast / Sonner integration - Alert - Progress - Spinner / Loading states

[ ] TASK-009: Create app layout structure - Root layout with fonts, metadata, providers - Marketing layout (public pages) - Dashboard layout (protected pages) - Auth layout

[ ] TASK-010: Implement Supabase authentication - Login page with email/password and OAuth (Google, GitHub) - Signup page with email verification - Auth callback route handler - Password reset flow - Session management middleware

[ ] TASK-011: Create protected route wrapper - Server-side auth check component - Redirect to login if unauthenticated - Loading states during auth check

[ ] TASK-012: Set up Stripe integration - Install stripe @stripe/stripe-js - Create lib/stripe/client.ts - Configure products and prices in Stripe dashboard - Create checkout session API route - Create customer portal API route

[ ] TASK-013: Implement Stripe webhook handler - Webhook signature verification - Handle checkout.session.completed - Handle customer.subscription.updated - Handle customer.subscription.deleted - Sync subscription status to Supabase

[ ] TASK-014: Create subscription hooks and utilities - useSubscription hook (fetch user's current plan) - checkAccess utility (can user access this block?) - Subscription context provider

[ ] TASK-015: Set up Playwright testing infrastructure - Install @playwright/test - Configure playwright.config.ts - Create test fixtures (authenticated user, etc.) - Create first smoke test (homepage loads)
```

### Phase 2: Marketplace Core (Tasks 16-30)

```markdown
[ ] TASK-016: Build the block registry system - Create lib/blocks/registry.ts with type definitions - Implement dynamic block metadata loading - Create block category constants

[ ] TASK-017: Build block file loader utility - Read block source code from filesystem - Parse TypeScript interfaces from blocks - Extract dependencies from imports

[ ] TASK-018: Create BlockCard component - Preview image with lazy loading - Block name, category badge, tier badge - View count, copy count stats - Hover animation with scale

[ ] TASK-019: Create BlockPreview component - Live component rendering in iframe sandbox - Style switching with theme context - Responsive preview (desktop/tablet/mobile) - Loading skeleton state

[ ] TASK-020: Create CodeViewer component - Syntax highlighting with Shiki - Line numbers - Copy button integration - Collapsible sections for long code

[ ] TASK-021: Create CopyButton component - Copy to clipboard with visual feedback - "Copy Code" mode (full source) - "Copy CLI" mode (npx command) - Pro only - Success/error toast notifications

[ ] TASK-022: Build StyleVisualizer component - Global style toggle (Minimalist/High-Brand/Neo-Industrial) - Theme context provider - CSS variable injection - Persist preference to localStorage

[ ] TASK-023: Create blocks listing page (/dashboard/blocks) - Category filter sidebar - Search input with debounce - Tier filter (Free/Pro) - Grid layout with BlockCards - Pagination or infinite scroll

[ ] TASK-024: Create block detail page (/dashboard/blocks/[slug]) - Full BlockPreview with style toggle - CodeViewer with copy options - Props documentation table - Related blocks carousel - Access gate for Pro blocks

[ ] TASK-025: Build first 5 Hero blocks - HeroGradient (free) - HeroCentered (free) - HeroSplit (free) - HeroVideo (pro) - HeroAnimated (pro) - Include all 3 style variants each

[ ] TASK-026: Build first 5 Navbar blocks - NavbarSimple (free) - NavbarWithDropdowns (free) - NavbarTransparent (free) - NavbarMegaMenu (pro) - NavbarWithSearch (pro) - Include mobile responsive variants

[ ] TASK-027: Build first 5 Footer blocks - FooterSimple (free) - FooterColumns (free) - FooterWithNewsletter (free) - FooterMegaLinks (pro) - FooterWithSocial (pro)

[ ] TASK-028: Build first 5 Features blocks - FeaturesGrid (free) - FeaturesAlternating (free) - FeaturesBento (free) - FeaturesWithIcons (pro) - FeaturesAnimated (pro)

[ ] TASK-029: Build first 5 CTA blocks - CTASimple (free) - CTAWithImage (free) - CTABanner (free) - CTAFloating (pro) - CTAAnimatedGradient (pro)

[ ] TASK-030: Implement block analytics tracking - Track view events (debounced) - Track copy events - Store in block_analytics table - Update block view_count/copy_count
```

### Phase 3: Landing & Pricing (Tasks 31-40)

```markdown
[ ] TASK-031: Build marketing landing page - Hero section showcasing the product - Features grid (Code-first, Performance, Affordable) - Block showcase carousel - Social proof / testimonials - Final CTA

[ ] TASK-032: Build pricing page - Free vs Pro comparison table - Interactive pricing cards - FAQ accordion - Stripe checkout integration - Annual discount option (future)

[ ] TASK-033: Build changelog page - Markdown-based changelog entries - Version badges - Filter by category

[ ] TASK-034: Create dashboard home page - Welcome message with user name - Quick stats (blocks copied, generations used) - Recent activity feed - Upgrade CTA for free users

[ ] TASK-035: Create settings page - Profile settings (name, avatar) - Subscription management (Stripe portal link) - Theme preferences - API key management (future)

[ ] TASK-036: Build user profile dropdown - Avatar with fallback initials - Name and email display - Quick links (Dashboard, Settings) - Sign out button - Subscription badge

[ ] TASK-037: Implement proper SEO - Dynamic metadata for all pages - OpenGraph images - JSON-LD schemas - Sitemap.xml generation - Robots.txt

[ ] TASK-038: Add loading states and skeletons - Block grid skeleton - Block detail skeleton - Dashboard skeleton - Smooth transitions

[ ] TASK-039: Implement error boundaries - Global error boundary - Component-level error boundaries - Fallback UI components - Error reporting (optional: Sentry)

[ ] TASK-040: Add toast notifications system - Success toasts (copy, save, etc.) - Error toasts - Action toasts (undo, etc.) - Queue management
```

### Phase 4: AI Generator (Tasks 41-50)

```markdown
[ ] TASK-041: Build Generator intake page - Large textarea for project description - Example prompts / templates - Character count - Submit button with loading state

[ ] TASK-042: Implement sitemap generation API - POST /api/generate endpoint - Claude API integration - Prompt engineering for sitemap - Rate limiting for free users

[ ] TASK-043: Build wireframe preview component - Visual sitemap representation - Page cards with section list - Drag-and-drop reordering (future) - Connection lines between pages

[ ] TASK-044: Build section block selector - Shows suggested block for each section - "Shuffle" button to get alternative - Block preview on hover - Lock/unlock sections

[ ] TASK-045: Implement block shuffling logic - Fetch alternative blocks by category - Exclude currently selected - Respect tier restrictions - Animate swap

[ ] TASK-046: Build generation result page - Tabbed view per page - Full preview of assembled site - Section-by-section code view - Export options

[ ] TASK-047: Implement "Copy Full Site" export - Assemble all selected blocks - Generate page files - Create ZIP archive - Download trigger - Pro-only gate

[ ] TASK-048: Implement generation usage tracking - Track generations per user per month - Check limits before generation - Show usage in dashboard - Reset on subscription renewal

[ ] TASK-049: Build generation history - List past generations - Re-open and edit - Delete generations - Pagination

[ ] TASK-050: Add more blocks (20 total per category) - Pricing blocks (5) - Testimonials blocks (5) - FAQ blocks (5) - Contact blocks (5) - Logo cloud blocks (5) - Stats blocks (5)
```

### Phase 5: Polish & Deploy (Tasks 51-60)

```markdown
[ ] TASK-051: Performance optimization - Implement React Server Components where possible - Add suspense boundaries - Optimize images with next/image - Lazy load below-fold content - Measure and hit 100 Lighthouse

[ ] TASK-052: Accessibility audit - ARIA labels on interactive elements - Keyboard navigation - Focus management - Color contrast checks - Screen reader testing

[ ] TASK-053: Mobile responsiveness polish - Test all pages on mobile - Fix any overflow issues - Optimize touch targets - Test mobile navigation

[ ] TASK-054: Write comprehensive Playwright tests - Auth flow tests (signup, login, logout) - Block browsing tests - Copy functionality tests - Checkout flow tests - Generator flow tests

[ ] TASK-055: Set up CI/CD pipeline - GitHub Actions workflow - Run tests on PR - Build verification - Preview deployments

[ ] TASK-056: Configure Vercel deployment - Connect repository - Set environment variables - Configure custom domain - Set up preview branches

[ ] TASK-057: Set up monitoring and analytics - Vercel Analytics - Error tracking (optional: Sentry) - Custom event tracking - Uptime monitoring

[ ] TASK-058: Create documentation - README.md with setup instructions - Contributing guide - Block creation guide - API documentation

[ ] TASK-059: Legal pages - Terms of Service - Privacy Policy - Cookie Policy

[ ] TASK-060: Launch checklist - Final QA pass - Stripe live mode activation - DNS propagation check - Social media assets - Announcement post draft
```

---

## 🧪 Playwright Test Examples

```typescript
// tests/e2e/auth.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should allow user to sign up", async ({ page }) => {
    await page.goto("/signup");

    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "SecurePassword123!");
    await page.click('button[type="submit"]');

    // Should redirect to confirm email page or dashboard
    await expect(page).toHaveURL(/\/(confirm-email|dashboard)/);
  });

  test("should allow user to log in", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "existing@example.com");
    await page.fill('input[name="password"]', "ExistingPassword123!");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator("text=Welcome")).toBeVisible();
  });

  test("should protect dashboard routes", async ({ page }) => {
    await page.goto("/dashboard");

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});
```

```typescript
// tests/e2e/blocks.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Block Library", () => {
  test.beforeEach(async ({ page }) => {
    // Login as test user
    await page.goto("/login");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "TestPassword123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("should display block grid", async ({ page }) => {
    await page.goto("/dashboard/blocks");

    const blockCards = page.locator('[data-testid="block-card"]');
    await expect(blockCards).toHaveCount({ minimum: 10 });
  });

  test("should filter blocks by category", async ({ page }) => {
    await page.goto("/dashboard/blocks");

    await page.click('button[data-category="hero"]');

    const categoryBadges = page.locator('[data-testid="category-badge"]');
    const allHero = await categoryBadges.allTextContents();
    expect(allHero.every((text) => text.toLowerCase().includes("hero"))).toBe(
      true
    );
  });

  test("should copy block code to clipboard", async ({ page }) => {
    await page.goto("/dashboard/blocks/hero-gradient");

    await page.click('[data-testid="copy-code-button"]');

    await expect(page.locator("text=Copied!")).toBeVisible();
  });

  test("should toggle style visualizer", async ({ page }) => {
    await page.goto("/dashboard/blocks/hero-gradient");

    const preview = page.locator('[data-testid="block-preview"]');

    // Click High-Brand style
    await page.click('button[data-style="high_brand"]');

    // Verify style changed (check for a specific class or CSS variable)
    await expect(preview).toHaveCSS("--primary", /262/);
  });
});
```

---

## 🔧 Environment Variables

```bash
# .env.local.example

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...

# AI (Anthropic)
ANTHROPIC_API_KEY=sk-ant-...

# Optional
SENTRY_DSN=
VERCEL_URL=
```

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Run database migrations
npx supabase db push

# Start development server
npm run dev

# Run tests
npm run test        # Unit tests (Vitest)
npm run test:e2e    # E2E tests (Playwright)

# Build for production
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## 📝 Claude Code Execution Command

Copy this entire prompt to Claude Code to begin implementation:

```
You are building LaufBlocks V2, a premium React/Next.js component library.

CONFIGURATION:
1. Ensure Supabase MCP server is installed for database interactions
2. Ensure Playwright MCP server is installed for UI testing

EXECUTION PROTOCOL:
1. Read the full specification above
2. Create a TODO list with all 60 tasks
3. For EACH task:
   a. Deploy a separate task sub-agent to implement it
   b. After completion, run: npm run build
   c. After build passes, run: npm run test:e2e
   d. If tests fail, iterate until passing
   e. Mark task complete
4. Continue until all tasks are done

START: Begin with TASK-001 (Initialize Next.js project)
```

---

_This specification is the single source of truth. Follow it precisely._
