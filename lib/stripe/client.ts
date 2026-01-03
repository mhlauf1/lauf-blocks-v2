import Stripe from "stripe";

/**
 * Stripe server-side client.
 * Use this for server-side operations like creating checkout sessions.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});
