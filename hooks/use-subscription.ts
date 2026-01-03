"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SubscriptionTier, SubscriptionStatus } from "@/lib/supabase/types";

export interface SubscriptionState {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  loading: boolean;
  isPro: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date | null;
}

/**
 * Hook to fetch and track the current user's subscription state.
 */
export function useSubscription(): SubscriptionState {
  const [state, setState] = useState<SubscriptionState>({
    tier: "free",
    status: "active",
    loading: true,
    isPro: false,
    cancelAtPeriodEnd: false,
    currentPeriodEnd: null,
  });

  useEffect(() => {
    const supabase = createClient();

    async function fetchSubscription() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }

      const { data: subscription, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !subscription) {
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }

      // Type assertion for subscription data
      const sub = subscription as {
        tier: SubscriptionTier;
        status: SubscriptionStatus;
        cancel_at_period_end: boolean;
        current_period_end: string | null;
      };

      setState({
        tier: sub.tier,
        status: sub.status,
        loading: false,
        isPro: sub.tier === "pro" && sub.status === "active",
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        currentPeriodEnd: sub.current_period_end
          ? new Date(sub.current_period_end)
          : null,
      });
    }

    fetchSubscription();

    // Subscribe to auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(() => {
      fetchSubscription();
    });

    return () => authSubscription.unsubscribe();
  }, []);

  return state;
}
