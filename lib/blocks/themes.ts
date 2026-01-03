/**
 * Block Theme Configurations
 *
 * Defines the 3 DNA styles for LaufBlocks:
 * - Minimalist: High whitespace, thin borders, subtle
 * - High-Brand: Bold typography, vibrant accents, gradients
 * - Neo-Industrial: Dark mode, thick borders, high contrast
 */

import type { BlockStyle } from "@/lib/supabase/types";

/**
 * Theme configuration for a single style
 */
export interface ThemeConfig {
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** CSS variables to inject */
  cssVariables: Record<string, string>;
  /** Tailwind class overrides */
  tailwindClasses?: {
    fontWeight?: string;
    borderWidth?: string;
    letterSpacing?: string;
  };
}

/**
 * All theme configurations
 */
export const THEMES: Record<BlockStyle, ThemeConfig> = {
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
      "--background": "0 0% 100%",
      "--foreground": "240 5% 10%",
    },
    tailwindClasses: {
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
      "--border": "262 40% 80%",
      "--radius": "0.75rem",
      "--background": "0 0% 100%",
      "--foreground": "262 40% 10%",
    },
    tailwindClasses: {
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
    tailwindClasses: {
      fontWeight: "500",
      borderWidth: "3px",
      letterSpacing: "0.05em",
    },
  },
};

/**
 * Get theme config by style
 */
export function getTheme(style: BlockStyle): ThemeConfig {
  return THEMES[style];
}

/**
 * Get all theme styles as array
 */
export function getAllStyles(): BlockStyle[] {
  return Object.keys(THEMES) as BlockStyle[];
}

/**
 * Get theme name by style
 */
export function getThemeName(style: BlockStyle): string {
  return THEMES[style].name;
}

/**
 * Convert CSS variables object to CSS string
 */
export function themeToCssString(style: BlockStyle): string {
  const theme = THEMES[style];
  return Object.entries(theme.cssVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n");
}

/**
 * Convert CSS variables to inline style object
 */
export function themeToStyleObject(
  style: BlockStyle
): React.CSSProperties {
  const theme = THEMES[style];
  const styleObj: Record<string, string> = {};

  for (const [key, value] of Object.entries(theme.cssVariables)) {
    // Convert CSS variable name to camelCase property
    styleObj[key] = value;
  }

  return styleObj as React.CSSProperties;
}

/**
 * Default theme to use
 */
export const DEFAULT_STYLE: BlockStyle = "minimalist";
