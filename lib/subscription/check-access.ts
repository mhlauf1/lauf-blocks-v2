import type { SubscriptionTier, BlockTier } from "@/lib/supabase/types";

/**
 * Check if a user's subscription tier grants access to a block tier.
 */
export function checkBlockAccess(
  userTier: SubscriptionTier | null | undefined,
  blockTier: BlockTier
): boolean {
  // Pro users can access everything
  if (userTier === "pro") {
    return true;
  }

  // Free users can only access free blocks
  return blockTier === "free";
}

/**
 * Check if a user has Pro tier access.
 */
export function hasProAccess(
  tier: SubscriptionTier | null | undefined
): boolean {
  return tier === "pro";
}

/**
 * Check if a user can use the AI generator based on their tier and usage.
 */
export function canUseGenerator(
  tier: SubscriptionTier | null | undefined,
  usedThisMonth: number
): boolean {
  // Pro users have unlimited generations
  if (tier === "pro") {
    return true;
  }

  // Free users get 1 generation per month
  return usedThisMonth < 1;
}

/**
 * Check if a user can export to a specific format.
 */
export function canExportAs(
  tier: SubscriptionTier | null | undefined,
  format: "copy" | "zip" | "cli"
): boolean {
  // Everyone can copy/paste
  if (format === "copy") {
    return true;
  }

  // ZIP and CLI are Pro-only
  return tier === "pro";
}
