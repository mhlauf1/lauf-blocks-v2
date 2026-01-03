import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { trackBlockEvent, type AnalyticsAction } from "@/lib/blocks/analytics";

// ============================================
// TYPES
// ============================================

interface AnalyticsRequestBody {
  action: AnalyticsAction;
  metadata?: Record<string, unknown>;
}

// ============================================
// POST /api/blocks/[slug]/analytics
// ============================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Parse request body
    const body: AnalyticsRequestBody = await request.json();

    // Validate action
    if (!["view", "copy_code", "copy_cli"].includes(body.action)) {
      return NextResponse.json(
        { error: "Invalid action type" },
        { status: 400 }
      );
    }

    // Get current user (optional - analytics can be anonymous)
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id || null;
    } catch {
      // Continue without user ID
    }

    // Track the event
    const result = await trackBlockEvent(
      {
        blockSlug: slug,
        action: body.action,
        metadata: body.metadata,
      },
      userId
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to track event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================
// GET /api/blocks/[slug]/analytics
// ============================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Get block stats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("blocks")
      .select("view_count, copy_count")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      // Block might not exist in DB
      return NextResponse.json({
        viewCount: 0,
        copyCount: 0,
      });
    }

    return NextResponse.json({
      viewCount: (data.view_count as number) ?? 0,
      copyCount: (data.copy_count as number) ?? 0,
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
