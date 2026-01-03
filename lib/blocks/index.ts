/**
 * Block Library Exports
 *
 * Central export point for all block-related utilities.
 */

// Registry
export {
  blockRegistry,
  registerBlock,
  getBlock,
  getAllBlocks,
  getBlocksByCategory,
  getBlocksByTier,
  getFreeBlocks,
  getProBlocks,
  filterBlocks,
  searchBlocks,
  getRelatedBlocks,
  getBlockCountByCategory,
  getTotalBlockCount,
  getBlockCountByTier,
  blockExists,
  getBlockFilePath,
} from "./registry";

// Categories
export {
  CATEGORIES,
  getAllCategories,
  getCategory,
  getCategoryLabel,
  getCategoryIcon,
  CATEGORY_IDS,
  type CategoryMeta,
} from "./categories";

// Loader (server-only)
export {
  getBlockPath,
  getVariantPath,
  loadBlockSource,
  loadBlockVariant,
  loadBlockWithSource,
  loadAllVariants,
  getDependencyInstallCommand,
  getCliCommand,
  blockSourceExists,
  listBlockFiles,
  scanAllBlockFiles,
} from "./loader";

// Parser
export {
  extractPropsInterface,
  parsePropsInterface,
  extractDependencies,
  extractComponentName,
  isClientComponent,
  extractDescription,
  parseBlockSource,
} from "./parser";

// Themes
export {
  THEMES,
  getTheme,
  getAllStyles,
  getThemeName,
  themeToCssString,
  themeToStyleObject,
  DEFAULT_STYLE,
  type ThemeConfig,
} from "./themes";

// Re-export types
export type {
  BlockMeta,
  PropDefinition,
  BlockWithSource,
  BlockVariantSource,
  BlockFilters,
  BlockStats,
} from "@/types/block";

export type {
  BlockCategory,
  BlockTier,
  BlockStyle,
} from "@/lib/supabase/types";
