"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================
// TYPES
// ============================================

export interface CtaSimpleProps {
  /** Main headline */
  headline: string;
  /** Supporting description */
  description?: string;
  /** Primary button */
  primaryCta: {
    label: string;
    href: string;
  };
  /** Optional secondary button */
  secondaryCta?: {
    label: string;
    href: string;
  };
  /** Center the content */
  centered?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function CtaSimple({
  headline,
  description,
  primaryCta,
  secondaryCta,
  centered = true,
}: CtaSimpleProps) {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className={centered ? "max-w-3xl mx-auto text-center" : ""}>
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {headline}
          </h2>

          {/* Description */}
          {description && (
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          )}

          {/* Buttons */}
          <div
            className={`mt-8 flex flex-col sm:flex-row gap-4 ${
              centered ? "justify-center" : ""
            }`}
          >
            <Button size="lg" asChild>
              <Link href={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            {secondaryCta && (
              <Button size="lg" variant="outline" asChild>
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
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

export default CtaSimple;
