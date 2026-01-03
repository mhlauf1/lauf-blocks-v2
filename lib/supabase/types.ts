/**
 * Database types for Supabase.
 * These types will be auto-generated from the database schema.
 * Run: npx supabase gen types typescript --project-id <project-id> > lib/supabase/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete";

export type SubscriptionTier = "free" | "pro";

export type BlockCategory =
  | "hero"
  | "navbar"
  | "footer"
  | "features"
  | "pricing"
  | "testimonials"
  | "cta"
  | "faq"
  | "contact"
  | "logos"
  | "stats"
  | "blog"
  | "ecommerce"
  | "auth"
  | "forms";

export type BlockTier = "free" | "pro";

export type BlockStyle = "minimalist" | "high_brand" | "neo_industrial";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          tier: SubscriptionTier;
          status: SubscriptionStatus;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          tier?: SubscriptionTier;
          status?: SubscriptionStatus;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          tier?: SubscriptionTier;
          status?: SubscriptionStatus;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      blocks: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          category: BlockCategory;
          tier: BlockTier;
          preview_image_url: string | null;
          source_code: string;
          props_interface: string | null;
          dependencies: Json;
          seo_schema: Json | null;
          is_published: boolean;
          view_count: number;
          copy_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          category: BlockCategory;
          tier?: BlockTier;
          preview_image_url?: string | null;
          source_code: string;
          props_interface?: string | null;
          dependencies?: Json;
          seo_schema?: Json | null;
          is_published?: boolean;
          view_count?: number;
          copy_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          category?: BlockCategory;
          tier?: BlockTier;
          preview_image_url?: string | null;
          source_code?: string;
          props_interface?: string | null;
          dependencies?: Json;
          seo_schema?: Json | null;
          is_published?: boolean;
          view_count?: number;
          copy_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      block_variants: {
        Row: {
          id: string;
          block_id: string;
          style: BlockStyle;
          source_code: string;
          tailwind_config: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          block_id: string;
          style: BlockStyle;
          source_code: string;
          tailwind_config?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          block_id?: string;
          style?: BlockStyle;
          source_code?: string;
          tailwind_config?: Json | null;
          created_at?: string;
        };
      };
      site_generations: {
        Row: {
          id: string;
          user_id: string;
          prompt: string;
          sitemap: Json;
          selected_blocks: Json;
          is_exported: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prompt: string;
          sitemap: Json;
          selected_blocks: Json;
          is_exported?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          prompt?: string;
          sitemap?: Json;
          selected_blocks?: Json;
          is_exported?: boolean;
          created_at?: string;
        };
      };
      generation_usage: {
        Row: {
          id: string;
          user_id: string;
          month_year: string;
          generation_count: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          month_year: string;
          generation_count?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          month_year?: string;
          generation_count?: number;
        };
      };
      block_analytics: {
        Row: {
          id: string;
          block_id: string;
          user_id: string | null;
          action: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          block_id: string;
          user_id?: string | null;
          action: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          block_id?: string;
          user_id?: string | null;
          action?: string;
          metadata?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_block_stat: {
        Args: {
          block_uuid: string;
          stat_type: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      subscription_status: SubscriptionStatus;
      subscription_tier: SubscriptionTier;
      block_category: BlockCategory;
      block_tier: BlockTier;
      block_style: BlockStyle;
    };
  };
}

// Utility types for easier access
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Convenience types
export type Profile = Tables<"profiles">;
export type Subscription = Tables<"subscriptions">;
export type Block = Tables<"blocks">;
export type BlockVariant = Tables<"block_variants">;
export type SiteGeneration = Tables<"site_generations">;
export type GenerationUsage = Tables<"generation_usage">;
export type BlockAnalytic = Tables<"block_analytics">;
