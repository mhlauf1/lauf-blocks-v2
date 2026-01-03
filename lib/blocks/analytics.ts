/**
 * Block Analytics - Server-side tracking
 *
 * This module contains server-only analytics functions.
 * For client-side tracking, use lib/blocks/analytics-client.ts
 */

import { createClient } from "@/lib/supabase/server";
import type { BlockStyle } from "@/lib/supabase/types";

// ============================================
// TYPES
// ============================================

export type AnalyticsAction = "view" | "copy_code" | "copy_cli";

export interface AnalyticsEvent {
  blockSlug: string;
  action: AnalyticsAction;
  metadata?: {
    style?: BlockStyle;
    source?: string;
    [key: string]: unknown;
  };
}

export interface TrackEventResult {
  success: boolean;
  error?: string;
}

// ============================================
// SERVER FUNCTIONS
// ============================================

/**
 * Get block ID from slug using database lookup
 */
async function getBlockIdFromSlug(slug: string): Promise<string | null> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("blocks")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    // Block might not exist in DB yet (only in filesystem registry)
    return null;
  }

  return data.id as string;
}

/**
 * Track a block analytics event (server-side)
 * Called from the API route
 */
export async function trackBlockEvent(
  event: AnalyticsEvent,
  userId?: string | null
): Promise<TrackEventResult> {
  try {
    const supabase = await createClient();
    const blockId = await getBlockIdFromSlug(event.blockSlug);

    if (!blockId) {
      // Block not in database - skip analytics for filesystem-only blocks
      return { success: true };
    }

    // Insert analytics event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any)
      .from("block_analytics")
      .insert({
        block_id: blockId,
        user_id: userId || null,
        action: event.action,
        metadata: event.metadata || null,
      });

    if (insertError) {
      console.error("Failed to insert analytics event:", insertError);
      return { success: false, error: insertError.message };
    }

    // Update block stats
    const statType = event.action === "view" ? "view_count" : "copy_count";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: rpcError } = await (supabase as any).rpc("increment_block_stat", {
      block_uuid: blockId,
      stat_type: statType,
    });

    if (rpcError) {
      // Non-critical - event was still logged
      console.warn("Failed to increment block stat:", rpcError);
    }

    return { success: true };
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get analytics summary for a block (server-side)
 */
export async function getBlockAnalytics(slug: string): Promise<{
  viewCount: number;
  copyCount: number;
} | null> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("blocks")
      .select("view_count, copy_count")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      viewCount: data.view_count as number,
      copyCount: data.copy_count as number,
    };
  } catch {
    return null;
  }
}
