"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================
// TYPES
// ============================================

export interface HeroSplitProps {
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
  };
  /** Feature bullet points */
  features?: string[];
  /** Image source URL */
  imageSrc: string;
  /** Image alt text */
  imageAlt: string;
  /** Reverse layout (image on left) */
  reversed?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function HeroSplit({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  features,
  imageSrc,
  imageAlt,
  reversed = false,
}: HeroSplitProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
            reversed ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Content */}
          <div className={reversed ? "lg:order-2" : ""}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              {headline}
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              {subheadline}
            </p>

            {/* Features List */}
            {features && features.length > 0 && (
              <ul className="mt-8 space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <a href={primaryCta.href}>
                  {primaryCta.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>

              {secondaryCta && (
                <Button size="lg" variant="outline" asChild>
                  <a href={secondaryCta.href}>{secondaryCta.label}</a>
                </Button>
              )}
            </div>
          </div>

          {/* Image */}
          <div className={`relative ${reversed ? "lg:order-1" : ""}`}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// DEFAULT EXPORT FOR REGISTRY
// ============================================

export default HeroSplit;
