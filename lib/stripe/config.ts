export const PLANS = {
  free: {
    name: "Free",
    description: "Essential blocks for getting started",
    price: 0,
    features: [
      "50+ Essential Blocks",
      "1 Site Generation / month",
      "React Copy/Paste export",
      "Community support",
    ],
    limits: {
      blocks: "essential" as const,
      generationsPerMonth: 1,
      exportFormats: ["copy"] as const,
    },
  },
  pro: {
    name: "Pro",
    description: "Full access to the entire library",
    price: 1999, // $19.99 in cents
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || "",
    features: [
      "1,000+ Premium Blocks",
      "Unlimited Site Generations",
      "Full Project ZIP export",
      "CLI Access (npx lauf-blocks)",
      "Priority developer support",
    ],
    limits: {
      blocks: "all" as const,
      generationsPerMonth: Infinity,
      exportFormats: ["copy", "zip", "cli"] as const,
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;
export type Plan = (typeof PLANS)[PlanType];
