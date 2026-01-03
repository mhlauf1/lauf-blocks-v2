import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Handle successful checkout session completion.
 * Upgrades the user to Pro tier.
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId;
  const subscriptionId = session.subscription as string;

  if (!userId || !subscriptionId) {
    console.error("Missing userId or subscriptionId in checkout session");
    return;
  }

  const supabase = createAdminClient();

  // Get subscription details from Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover",
  });

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Get the first subscription item for period info
  const firstItem = subscription.items.data[0];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("subscriptions")
    .update({
      stripe_subscription_id: subscriptionId,
      stripe_price_id: firstItem?.price.id,
      tier: "pro",
      status: "active",
      current_period_start: firstItem ? new Date(firstItem.current_period_start * 1000).toISOString() : null,
      current_period_end: firstItem ? new Date(firstItem.current_period_end * 1000).toISOString() : null,
    })
    .eq("user_id", userId);

  console.log(`User ${userId} upgraded to Pro`);
}

/**
 * Handle subscription updates.
 * Syncs status changes from Stripe to Supabase.
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;

  const supabase = createAdminClient();

  // Find the user by their Stripe customer ID
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (error || !profile) {
    console.error("Could not find user for customer:", customerId);
    return;
  }

  const profileId = (profile as { id: string }).id;

  // Map Stripe status to our status type
  const statusMap: Record<string, string> = {
    active: "active",
    canceled: "canceled",
    past_due: "past_due",
    trialing: "trialing",
    incomplete: "incomplete",
    incomplete_expired: "canceled",
    unpaid: "past_due",
    paused: "canceled",
  };

  const status = statusMap[subscription.status] || "active";

  // Get period end from subscription item
  const firstItem = subscription.items.data[0];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("subscriptions")
    .update({
      status,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_end: firstItem ? new Date(firstItem.current_period_end * 1000).toISOString() : null,
    })
    .eq("user_id", profileId);

  console.log(`Updated subscription status for user ${profileId} to ${status}`);
}

/**
 * Handle subscription deletion/cancellation.
 * Downgrades the user to Free tier.
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;

  const supabase = createAdminClient();

  // Find the user by their Stripe customer ID
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (error || !profile) {
    console.error("Could not find user for customer:", customerId);
    return;
  }

  const profileId = (profile as { id: string }).id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("subscriptions")
    .update({
      tier: "free",
      status: "canceled",
      stripe_subscription_id: null,
      stripe_price_id: null,
    })
    .eq("user_id", profileId);

  console.log(`User ${profileId} downgraded to Free tier`);
}
