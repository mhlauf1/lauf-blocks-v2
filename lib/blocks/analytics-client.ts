/**
 * Block Analytics - Client-side tracking
 *
 * This module contains client-safe analytics functions.
 * These functions call the analytics API endpoint.
 */

import type { BlockStyle } from "@/lib/supabase/types";

// ============================================
// TYPES
// ============================================

type AnalyticsAction = "view" | "copy_code" | "copy_cli";

interface AnalyticsEvent {
  blockSlug: string;
  action: AnalyticsAction;
  metadata?: {
    style?: BlockStyle;
    source?: string;
    [key: string]: unknown;
  };
}

// ============================================
// DEBOUNCE MAP
// ============================================

/**
 * Debounce map for view tracking
 * Prevents multiple rapid view events for the same block
 */
const viewDebounceMap = new Map<string, number>();
const VIEW_DEBOUNCE_MS = 5000; // 5 seconds

/**
 * Check if we should track a view (debouncing)
 */
function shouldTrackView(slug: string): boolean {
  const now = Date.now();
  const lastTrack = viewDebounceMap.get(slug);

  if (lastTrack && now - lastTrack < VIEW_DEBOUNCE_MS) {
    return false;
  }

  viewDebounceMap.set(slug, now);
  return true;
}

// ============================================
// CLIENT FUNCTIONS
// ============================================

/**
 * Send analytics event to API
 */
async function sendAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
  // Debounce view events
  if (event.action === "view" && !shouldTrackView(event.blockSlug)) {
    return;
  }

  try {
    await fetch(`/api/blocks/${event.blockSlug}/analytics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: event.action,
        metadata: event.metadata,
      }),
    });
  } catch {
    // Silently fail - analytics should not break the user experience
  }
}

/**
 * Track a block view event
 */
export function trackBlockView(slug: string, style?: BlockStyle): void {
  sendAnalyticsEvent({
    blockSlug: slug,
    action: "view",
    metadata: style ? { style } : undefined,
  });
}

/**
 * Track a code copy event
 */
export function trackCodeCopy(
  slug: string,
  type: "code" | "cli",
  style?: BlockStyle
): void {
  sendAnalyticsEvent({
    blockSlug: slug,
    action: type === "cli" ? "copy_cli" : "copy_code",
    metadata: style ? { style } : undefined,
  });
}
