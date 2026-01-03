"use client";

import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles } from "lucide-react";
import type { SubscriptionTier } from "@/lib/supabase/types";

interface SubscriptionBadgeProps {
  tier: SubscriptionTier;
  size?: "sm" | "default";
  showIcon?: boolean;
}

export function SubscriptionBadge({
  tier,
  size = "default",
  showIcon = true,
}: SubscriptionBadgeProps) {
  if (tier === "pro") {
    return (
      <Badge
        variant="default"
        className={`bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 ${
          size === "sm" ? "text-xs px-2 py-0.5" : ""
        }`}
      >
        {showIcon && <Crown className="mr-1 h-3 w-3" />}
        Pro
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={size === "sm" ? "text-xs px-2 py-0.5" : ""}
    >
      {showIcon && <Sparkles className="mr-1 h-3 w-3" />}
      Free
    </Badge>
  );
}

interface BlockTierBadgeProps {
  tier: "free" | "pro";
  size?: "sm" | "default";
}

export function BlockTierBadge({ tier, size = "default" }: BlockTierBadgeProps) {
  if (tier === "pro") {
    return (
      <Badge
        variant="outline"
        className={`border-amber-500/50 text-amber-600 bg-amber-50 ${
          size === "sm" ? "text-xs px-2 py-0.5" : ""
        }`}
      >
        Pro
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`border-green-500/50 text-green-600 bg-green-50 ${
        size === "sm" ? "text-xs px-2 py-0.5" : ""
      }`}
    >
      Free
    </Badge>
  );
}
