"use client";

import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================
// TYPES
// ============================================

export interface HeroCenteredProps {
  /** Small label above the headline */
  badge?: string;
  /** Main headline text */
  headline: string;
  /** Supporting subheadline text */
  subheadline: string;
  /** Primary call-to-action button */
  primaryCta: {
    label: string;
    href: string;
  };
  /** Optional secondary call-to-action button */
  secondaryCta?: {
    label: string;
    href: string;
    icon?: "arrow" | "play";
  };
}

// ============================================
// COMPONENT
// ============================================

export function HeroCentered({
  badge,
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
}: HeroCenteredProps) {
  const SecondaryIcon = secondaryCta?.icon === "play" ? Play : ArrowRight;

  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground mb-6">
              {badge}
            </div>
          )}

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg md:text-xl text-muted-foreground">
            {subheadline}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>

            {secondaryCta && (
              <Button size="lg" variant="ghost" asChild>
                <a href={secondaryCta.href}>
                  <SecondaryIcon className="mr-2 h-4 w-4" />
                  {secondaryCta.label}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// DEFAULT EXPORT FOR REGISTRY
// ============================================

export default HeroCentered;
