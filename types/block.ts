/**
 * Block Types for the LaufBlocks Registry
 *
 * These types define the structure of blocks in the filesystem-based registry.
 * Blocks are created by the admin and consumed (read-only) by users.
 */

// Re-export database types for convenience
export type {
  BlockCategory,
  BlockTier,
  BlockStyle,
} from "@/lib/supabase/types";

import type { BlockCategory, BlockTier, BlockStyle } from "@/lib/supabase/types";

/**
 * Metadata for a block in the registry.
 * This is the source of truth for block information (stored in filesystem).
 */
export interface BlockMeta {
  /** Unique identifier (matches filename without extension) */
  id: string;

  /** URL-friendly slug for routing */
  slug: string;

  /** Display name */
  name: string;

  /** Short description for cards and previews */
  description: string;

  /** Block category (hero, navbar, footer, etc.) */
  category: BlockCategory;

  /** Access tier (free or pro) */
  tier: BlockTier;

  /** Path to preview image */
  previewImage: string;

  /** npm packages required by this block */
  dependencies: string[];

  /** Available style variants */
  styles: BlockStyle[];

  /** TypeScript props interface as a string (for documentation) */
  propsInterface?: string;

  /** Whether the block is published and visible to users */
  isPublished?: boolean;

  /** Optional JSON-LD schema for SEO */
  seoSchema?: Record<string, unknown>;
}

/**
 * A single prop definition parsed from the TypeScript interface
 */
export interface PropDefinition {
  /** Prop name */
  name: string;

  /** TypeScript type as string */
  type: string;

  /** Whether the prop is optional */
  optional: boolean;

  /** Description from JSDoc comment */
  description?: string;

  /** Default value if specified */
  defaultValue?: string;
}

/**
 * Block with source code loaded
 */
export interface BlockWithSource extends BlockMeta {
  /** Raw source code of the component */
  sourceCode: string;

  /** Parsed props from the interface */
  props: PropDefinition[];
}

/**
 * Block variant with its specific source code
 */
export interface BlockVariantSource {
  /** Block slug */
  blockSlug: string;

  /** Style variant */
  style: BlockStyle;

  /** Source code for this variant */
  sourceCode: string;

  /** Style-specific Tailwind config overrides */
  tailwindConfig?: Record<string, unknown>;
}

/**
 * Filter options for querying blocks
 */
export interface BlockFilters {
  category?: BlockCategory;
  tier?: BlockTier;
  style?: BlockStyle;
  search?: string;
  isPublished?: boolean;
}

/**
 * Block statistics for analytics
 */
export interface BlockStats {
  viewCount: number;
  copyCount: number;
}
