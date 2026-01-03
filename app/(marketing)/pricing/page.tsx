import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for LaufBlocks. Start free, upgrade when you need more.",
};

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that works for you. All plans include access to our
          core component library.
        </p>
      </div>

      <div className="text-center text-muted-foreground">
        <p>Full pricing page coming soon...</p>
      </div>
    </div>
  );
}
