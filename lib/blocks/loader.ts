/**
 * Block File Loader
 *
 * Reads block source code from the filesystem.
 * This runs on the server only.
 *
 * Blocks are stored in: components/blocks/{category}s/{slug}.tsx
 * Variants are stored in: components/blocks/{category}s/{slug}/{style}.tsx
 */

import { promises as fs } from "fs";
import path from "path";
import type { BlockStyle } from "@/lib/supabase/types";
import type { BlockMeta, BlockWithSource, BlockVariantSource } from "@/types/block";
import { getBlock } from "./registry";
import { parseBlockSource } from "./parser";

/**
 * Base path for block components
 */
const BLOCKS_DIR = path.join(process.cwd(), "components", "blocks");

/**
 * Get the file path for a block's main source file
 */
export function getBlockPath(category: string, slug: string): string {
  // Category directories are plural (heroes, navbars, footers, etc.)
  const categoryDir = category.endsWith("s") ? category : `${category}s`;
  return path.join(BLOCKS_DIR, categoryDir, `${slug}.tsx`);
}

/**
 * Get the file path for a block's style variant
 */
export function getVariantPath(
  category: string,
  slug: string,
  style: BlockStyle
): string {
  const categoryDir = category.endsWith("s") ? category : `${category}s`;
  return path.join(BLOCKS_DIR, categoryDir, slug, `${style}.tsx`);
}

/**
 * Check if a file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load block source code by slug
 */
export async function loadBlockSource(slug: string): Promise<string | null> {
  const block = getBlock(slug);
  if (!block) return null;

  const filePath = getBlockPath(block.category, slug);

  try {
    const source = await fs.readFile(filePath, "utf-8");
    return source;
  } catch (error) {
    console.error(`Failed to load block source for ${slug}:`, error);
    return null;
  }
}

/**
 * Load a specific style variant's source code
 *
 * If the variant file doesn't exist, falls back to the main file.
 */
export async function loadBlockVariant(
  slug: string,
  style: BlockStyle
): Promise<string | null> {
  const block = getBlock(slug);
  if (!block) return null;

  // If requesting minimalist style, use the main file
  if (style === "minimalist") {
    return loadBlockSource(slug);
  }

  // Try to load the variant file
  const variantPath = getVariantPath(block.category, slug, style);

  if (await fileExists(variantPath)) {
    try {
      const source = await fs.readFile(variantPath, "utf-8");
      return source;
    } catch (error) {
      console.error(`Failed to load variant ${style} for ${slug}:`, error);
    }
  }

  // Fallback to main file if variant doesn't exist
  return loadBlockSource(slug);
}

/**
 * Load a block with its full source code and parsed props
 */
export async function loadBlockWithSource(
  slug: string
): Promise<BlockWithSource | null> {
  const block = getBlock(slug);
  if (!block) return null;

  const sourceCode = await loadBlockSource(slug);
  if (!sourceCode) return null;

  const parsed = parseBlockSource(sourceCode);

  return {
    ...block,
    sourceCode,
    props: parsed.props,
  };
}

/**
 * Load all variants for a block
 */
export async function loadAllVariants(
  slug: string
): Promise<BlockVariantSource[]> {
  const block = getBlock(slug);
  if (!block) return [];

  const variants: BlockVariantSource[] = [];

  for (const style of block.styles) {
    const sourceCode = await loadBlockVariant(slug, style);
    if (sourceCode) {
      variants.push({
        blockSlug: slug,
        style,
        sourceCode,
      });
    }
  }

  return variants;
}

/**
 * Get the install command for a block's dependencies
 */
export function getDependencyInstallCommand(block: BlockMeta): string | null {
  if (block.dependencies.length === 0) return null;

  const deps = block.dependencies.join(" ");
  return `npm install ${deps}`;
}

/**
 * Get the CLI command to add a block (for Pro users)
 */
export function getCliCommand(slug: string): string {
  return `npx laufblocks add ${slug}`;
}

/**
 * Check if a block's source file exists
 */
export async function blockSourceExists(slug: string): Promise<boolean> {
  const block = getBlock(slug);
  if (!block) return false;

  const filePath = getBlockPath(block.category, slug);
  return fileExists(filePath);
}

/**
 * List all block files in a category directory
 */
export async function listBlockFiles(category: string): Promise<string[]> {
  const categoryDir = category.endsWith("s") ? category : `${category}s`;
  const dirPath = path.join(BLOCKS_DIR, categoryDir);

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
      .map((entry) => entry.name.replace(".tsx", ""));
  } catch {
    return [];
  }
}

/**
 * Scan all blocks directories and return found block files
 * Useful for verifying registry matches filesystem
 */
export async function scanAllBlockFiles(): Promise<
  { category: string; slug: string; path: string }[]
> {
  const results: { category: string; slug: string; path: string }[] = [];

  try {
    const categories = await fs.readdir(BLOCKS_DIR, { withFileTypes: true });

    for (const cat of categories) {
      if (!cat.isDirectory()) continue;

      const categoryPath = path.join(BLOCKS_DIR, cat.name);
      const files = await fs.readdir(categoryPath, { withFileTypes: true });

      for (const file of files) {
        if (file.isFile() && file.name.endsWith(".tsx")) {
          const slug = file.name.replace(".tsx", "");
          const category = cat.name.replace(/s$/, ""); // Remove trailing 's'

          results.push({
            category,
            slug,
            path: path.join(categoryPath, file.name),
          });
        }
      }
    }
  } catch {
    // Directory doesn't exist yet
  }

  return results;
}
