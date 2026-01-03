/**
 * Block Category Definitions
 *
 * Metadata for each block category including display names, descriptions, and icons.
 */

import type { BlockCategory } from "@/lib/supabase/types";
import {
  Layout,
  Navigation,
  PanelBottom,
  Grid3X3,
  DollarSign,
  MessageSquareQuote,
  MousePointerClick,
  HelpCircle,
  Mail,
  Building2,
  BarChart3,
  FileText,
  ShoppingCart,
  Lock,
  FormInput,
  type LucideIcon,
} from "lucide-react";

/**
 * Category metadata
 */
export interface CategoryMeta {
  /** Category key matching BlockCategory type */
  id: BlockCategory;

  /** Display label */
  label: string;

  /** Short description */
  description: string;

  /** Lucide icon component */
  icon: LucideIcon;

  /** Sort order for display */
  order: number;
}

/**
 * All block categories with their metadata
 */
export const CATEGORIES: Record<BlockCategory, CategoryMeta> = {
  hero: {
    id: "hero",
    label: "Hero",
    description: "Eye-catching hero sections for landing pages",
    icon: Layout,
    order: 1,
  },
  navbar: {
    id: "navbar",
    label: "Navbar",
    description: "Navigation bars and headers",
    icon: Navigation,
    order: 2,
  },
  footer: {
    id: "footer",
    label: "Footer",
    description: "Page footers with links and branding",
    icon: PanelBottom,
    order: 3,
  },
  features: {
    id: "features",
    label: "Features",
    description: "Feature showcases and benefit sections",
    icon: Grid3X3,
    order: 4,
  },
  pricing: {
    id: "pricing",
    label: "Pricing",
    description: "Pricing tables and plan comparisons",
    icon: DollarSign,
    order: 5,
  },
  testimonials: {
    id: "testimonials",
    label: "Testimonials",
    description: "Customer reviews and social proof",
    icon: MessageSquareQuote,
    order: 6,
  },
  cta: {
    id: "cta",
    label: "CTA",
    description: "Call-to-action sections",
    icon: MousePointerClick,
    order: 7,
  },
  faq: {
    id: "faq",
    label: "FAQ",
    description: "Frequently asked questions sections",
    icon: HelpCircle,
    order: 8,
  },
  contact: {
    id: "contact",
    label: "Contact",
    description: "Contact forms and information",
    icon: Mail,
    order: 9,
  },
  logos: {
    id: "logos",
    label: "Logos",
    description: "Logo clouds and partner showcases",
    icon: Building2,
    order: 10,
  },
  stats: {
    id: "stats",
    label: "Stats",
    description: "Statistics and metrics displays",
    icon: BarChart3,
    order: 11,
  },
  blog: {
    id: "blog",
    label: "Blog",
    description: "Blog post cards and article layouts",
    icon: FileText,
    order: 12,
  },
  ecommerce: {
    id: "ecommerce",
    label: "E-commerce",
    description: "Product cards and shopping components",
    icon: ShoppingCart,
    order: 13,
  },
  auth: {
    id: "auth",
    label: "Auth",
    description: "Login, signup, and authentication forms",
    icon: Lock,
    order: 14,
  },
  forms: {
    id: "forms",
    label: "Forms",
    description: "Form layouts and input groups",
    icon: FormInput,
    order: 15,
  },
};

/**
 * Get all categories sorted by order
 */
export function getAllCategories(): CategoryMeta[] {
  return Object.values(CATEGORIES).sort((a, b) => a.order - b.order);
}

/**
 * Get category metadata by id
 */
export function getCategory(id: BlockCategory): CategoryMeta {
  return CATEGORIES[id];
}

/**
 * Get category label
 */
export function getCategoryLabel(id: BlockCategory): string {
  return CATEGORIES[id].label;
}

/**
 * Get category icon
 */
export function getCategoryIcon(id: BlockCategory): LucideIcon {
  return CATEGORIES[id].icon;
}

/**
 * All category IDs as an array (for iteration)
 */
export const CATEGORY_IDS = Object.keys(CATEGORIES) as BlockCategory[];
