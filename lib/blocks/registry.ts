/**
 * Block Registry
 *
 * The source of truth for all blocks in the LaufBlocks library.
 * Blocks are defined here by the admin and consumed by users.
 *
 * To add a new block:
 * 1. Create the component file in components/blocks/{category}/
 * 2. Add an entry to the blockRegistry below
 * 3. Run build to verify
 */

import type { BlockCategory, BlockTier, BlockStyle } from "@/lib/supabase/types";
import type { BlockMeta, BlockFilters } from "@/types/block";

/**
 * The block registry - all available blocks
 *
 * This will be populated as blocks are created in Tasks 25-29.
 * For now, it's initialized empty and ready for blocks to be added.
 */
export const blockRegistry = new Map<string, BlockMeta>();

/**
 * Register a block in the registry
 */
export function registerBlock(block: BlockMeta): void {
  blockRegistry.set(block.slug, block);
}

/**
 * Get a block by its slug
 */
export function getBlock(slug: string): BlockMeta | undefined {
  return blockRegistry.get(slug);
}

/**
 * Get all blocks as an array
 */
export function getAllBlocks(): BlockMeta[] {
  return Array.from(blockRegistry.values()).filter(
    (block) => block.isPublished !== false
  );
}

/**
 * Get blocks by category
 */
export function getBlocksByCategory(category: BlockCategory): BlockMeta[] {
  return getAllBlocks().filter((block) => block.category === category);
}

/**
 * Get blocks by tier
 */
export function getBlocksByTier(tier: BlockTier): BlockMeta[] {
  return getAllBlocks().filter((block) => block.tier === tier);
}

/**
 * Get free blocks only
 */
export function getFreeBlocks(): BlockMeta[] {
  return getBlocksByTier("free");
}

/**
 * Get pro blocks only
 */
export function getProBlocks(): BlockMeta[] {
  return getBlocksByTier("pro");
}

/**
 * Filter blocks with multiple criteria
 */
export function filterBlocks(filters: BlockFilters): BlockMeta[] {
  let blocks = getAllBlocks();

  if (filters.category) {
    blocks = blocks.filter((block) => block.category === filters.category);
  }

  if (filters.tier) {
    blocks = blocks.filter((block) => block.tier === filters.tier);
  }

  if (filters.style) {
    blocks = blocks.filter((block) => block.styles.includes(filters.style!));
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    blocks = blocks.filter(
      (block) =>
        block.name.toLowerCase().includes(searchLower) ||
        block.description.toLowerCase().includes(searchLower) ||
        block.slug.toLowerCase().includes(searchLower)
    );
  }

  if (filters.isPublished !== undefined) {
    blocks = blocks.filter(
      (block) => (block.isPublished ?? true) === filters.isPublished
    );
  }

  return blocks;
}

/**
 * Search blocks by query string
 */
export function searchBlocks(query: string): BlockMeta[] {
  return filterBlocks({ search: query });
}

/**
 * Get related blocks (same category, different block)
 */
export function getRelatedBlocks(slug: string, limit = 5): BlockMeta[] {
  const block = getBlock(slug);
  if (!block) return [];

  return getBlocksByCategory(block.category)
    .filter((b) => b.slug !== slug)
    .slice(0, limit);
}

/**
 * Get block count by category
 */
export function getBlockCountByCategory(): Record<BlockCategory, number> {
  const counts: Partial<Record<BlockCategory, number>> = {};

  for (const block of getAllBlocks()) {
    counts[block.category] = (counts[block.category] ?? 0) + 1;
  }

  return counts as Record<BlockCategory, number>;
}

/**
 * Get total block count
 */
export function getTotalBlockCount(): number {
  return getAllBlocks().length;
}

/**
 * Get block count by tier
 */
export function getBlockCountByTier(): Record<BlockTier, number> {
  return {
    free: getFreeBlocks().length,
    pro: getProBlocks().length,
  };
}

/**
 * Check if a block exists
 */
export function blockExists(slug: string): boolean {
  return blockRegistry.has(slug);
}

/**
 * Get the file path for a block's source code
 */
export function getBlockFilePath(
  slug: string,
  style?: BlockStyle
): string | undefined {
  const block = getBlock(slug);
  if (!block) return undefined;

  const basePath = `components/blocks/${block.category}s`;

  if (style && style !== "minimalist") {
    // Variants are in subdirectories
    return `${basePath}/${slug}/${style}.tsx`;
  }

  // Default/minimalist style is the main file
  return `${basePath}/${slug}.tsx`;
}

// ============================================
// BLOCK DEFINITIONS
// ============================================

// ----- HERO BLOCKS -----

registerBlock({
  id: "hero-gradient",
  slug: "hero-gradient",
  name: "Gradient Hero",
  description: "A bold hero section with animated gradient background and customizable colors",
  category: "hero",
  tier: "free",
  previewImage: "/blocks/heroes/hero-gradient.png",
  dependencies: ["framer-motion"],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "hero-centered",
  slug: "hero-centered",
  name: "Centered Hero",
  description: "A clean, centered hero layout with optional badge and dual CTAs",
  category: "hero",
  tier: "free",
  previewImage: "/blocks/heroes/hero-centered.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "hero-split",
  slug: "hero-split",
  name: "Split Hero",
  description: "A two-column hero with image on one side and content on the other, featuring bullet points",
  category: "hero",
  tier: "free",
  previewImage: "/blocks/heroes/hero-split.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "hero-video",
  slug: "hero-video",
  name: "Video Hero",
  description: "A full-screen hero with video background, overlay controls, and play/mute toggles",
  category: "hero",
  tier: "pro",
  previewImage: "/blocks/heroes/hero-video.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "hero-animated",
  slug: "hero-animated",
  name: "Animated Hero",
  description: "A dynamic hero with Framer Motion animations, floating particles, and text cycling",
  category: "hero",
  tier: "pro",
  previewImage: "/blocks/heroes/hero-animated.png",
  dependencies: ["framer-motion"],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

// ----- NAVBAR BLOCKS -----

registerBlock({
  id: "navbar-simple",
  slug: "navbar-simple",
  name: "Simple Navbar",
  description: "A clean navigation bar with logo, links, and CTA button with mobile menu",
  category: "navbar",
  tier: "free",
  previewImage: "/blocks/navbars/navbar-simple.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "navbar-dropdowns",
  slug: "navbar-dropdowns",
  name: "Dropdown Navbar",
  description: "Navigation bar with dropdown menus for nested link structures",
  category: "navbar",
  tier: "free",
  previewImage: "/blocks/navbars/navbar-dropdowns.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "navbar-transparent",
  slug: "navbar-transparent",
  name: "Transparent Navbar",
  description: "A transparent navbar that reveals a backdrop on scroll, perfect for hero sections",
  category: "navbar",
  tier: "free",
  previewImage: "/blocks/navbars/navbar-transparent.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "navbar-megamenu",
  slug: "navbar-megamenu",
  name: "Mega Menu Navbar",
  description: "A full-width mega menu navigation with sections, descriptions, and featured content",
  category: "navbar",
  tier: "pro",
  previewImage: "/blocks/navbars/navbar-megamenu.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "navbar-search",
  slug: "navbar-search",
  name: "Search Navbar",
  description: "Navigation bar with integrated search functionality and keyboard shortcut support",
  category: "navbar",
  tier: "pro",
  previewImage: "/blocks/navbars/navbar-search.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

// ----- FOOTER BLOCKS -----

registerBlock({
  id: "footer-simple",
  slug: "footer-simple",
  name: "Simple Footer",
  description: "A minimal footer with logo, quick links, and copyright notice",
  category: "footer",
  tier: "free",
  previewImage: "/blocks/footers/footer-simple.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "footer-columns",
  slug: "footer-columns",
  name: "Column Footer",
  description: "A multi-column footer layout with organized link sections",
  category: "footer",
  tier: "free",
  previewImage: "/blocks/footers/footer-columns.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "footer-newsletter",
  slug: "footer-newsletter",
  name: "Newsletter Footer",
  description: "Footer with integrated email newsletter signup form",
  category: "footer",
  tier: "free",
  previewImage: "/blocks/footers/footer-newsletter.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "footer-megalinks",
  slug: "footer-megalinks",
  name: "Mega Links Footer",
  description: "An extensive footer with multiple sections, badges, and comprehensive site navigation",
  category: "footer",
  tier: "pro",
  previewImage: "/blocks/footers/footer-megalinks.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "footer-social",
  slug: "footer-social",
  name: "Social Footer",
  description: "A social-first footer with prominent social media icons and centered layout",
  category: "footer",
  tier: "pro",
  previewImage: "/blocks/footers/footer-social.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

// ----- FEATURES BLOCKS -----

registerBlock({
  id: "features-grid",
  slug: "features-grid",
  name: "Grid Features",
  description: "A clean grid layout for showcasing features with icons and descriptions",
  category: "features",
  tier: "free",
  previewImage: "/blocks/features/features-grid.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "features-alternating",
  slug: "features-alternating",
  name: "Alternating Features",
  description: "Left-right alternating layout with images and feature bullet points",
  category: "features",
  tier: "free",
  previewImage: "/blocks/features/features-alternating.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "features-bento",
  slug: "features-bento",
  name: "Bento Features",
  description: "A modern bento box grid layout with varying card sizes",
  category: "features",
  tier: "free",
  previewImage: "/blocks/features/features-bento.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "features-icons",
  slug: "features-icons",
  name: "Icon Features",
  description: "Large icon-focused features with multiple layout variants",
  category: "features",
  tier: "pro",
  previewImage: "/blocks/features/features-icons.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "features-animated",
  slug: "features-animated",
  name: "Animated Features",
  description: "Scroll-triggered animated features with stagger effects and hover interactions",
  category: "features",
  tier: "pro",
  previewImage: "/blocks/features/features-animated.png",
  dependencies: ["framer-motion"],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

// ----- CTA BLOCKS -----

registerBlock({
  id: "cta-simple",
  slug: "cta-simple",
  name: "Simple CTA",
  description: "A clean call-to-action section with headline and buttons",
  category: "cta",
  tier: "free",
  previewImage: "/blocks/cta/cta-simple.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "cta-image",
  slug: "cta-image",
  name: "Image CTA",
  description: "Call-to-action with a side image and content layout",
  category: "cta",
  tier: "free",
  previewImage: "/blocks/cta/cta-image.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "cta-banner",
  slug: "cta-banner",
  name: "Banner CTA",
  description: "Full-width banner with multiple color variants and inline layout",
  category: "cta",
  tier: "free",
  previewImage: "/blocks/cta/cta-banner.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "cta-floating",
  slug: "cta-floating",
  name: "Floating CTA",
  description: "A fixed bottom bar that appears after delay with dismissible functionality",
  category: "cta",
  tier: "pro",
  previewImage: "/blocks/cta/cta-floating.png",
  dependencies: [],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});

registerBlock({
  id: "cta-gradient",
  slug: "cta-gradient",
  name: "Gradient CTA",
  description: "A vibrant CTA with animated gradient background and floating orbs",
  category: "cta",
  tier: "pro",
  previewImage: "/blocks/cta/cta-gradient.png",
  dependencies: ["framer-motion"],
  styles: ["minimalist", "high_brand", "neo_industrial"],
});
