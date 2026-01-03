"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface IconFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
}

export interface FeaturesIconsProps {
  /** Section badge/label */
  badge?: string;
  /** Section heading */
  heading: string;
  /** Section subheading */
  subheading?: string;
  /** Features to display */
  features: IconFeature[];
  /** Layout variant */
  variant?: "default" | "centered" | "cards";
}

// ============================================
// COMPONENT
// ============================================

export function FeaturesIcons({
  badge,
  heading,
  subheading,
  features,
  variant = "default",
}: FeaturesIconsProps) {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          {badge && (
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-4">
              {badge}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-4 text-lg text-muted-foreground">{subheading}</p>
          )}
        </div>

        {/* Features */}
        <div
          className={cn(
            "grid gap-8 md:gap-12",
            variant === "cards"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2"
          )}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group",
                variant === "centered" && "text-center",
                variant === "cards" &&
                  "p-8 rounded-2xl bg-background border border-border hover:border-primary/50 hover:shadow-lg transition-all"
              )}
            >
              {/* Large Icon */}
              <div
                className={cn(
                  "mb-6",
                  variant === "centered" && "flex justify-center"
                )}
              >
                <div
                  className={cn(
                    "inline-flex items-center justify-center rounded-2xl transition-colors",
                    "w-16 h-16 bg-primary/10 text-primary",
                    variant === "cards" &&
                      "group-hover:bg-primary group-hover:text-primary-foreground"
                  )}
                >
                  <feature.icon className="w-8 h-8" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Link */}
              {feature.href && (
                <Link
                  href={feature.href}
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline",
                    variant === "centered" && "justify-center"
                  )}
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// DEFAULT EXPORT FOR REGISTRY
// ============================================

export default FeaturesIcons;
