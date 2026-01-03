"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FeaturesGridProps {
  /** Section badge/label */
  badge?: string;
  /** Section heading */
  heading: string;
  /** Section subheading */
  subheading?: string;
  /** Features to display (max 6 for 3x2 grid) */
  features: Feature[];
  /** Number of columns (2, 3, or 4) */
  columns?: 2 | 3 | 4;
}

// ============================================
// COMPONENT
// ============================================

export function FeaturesGrid({
  badge,
  heading,
  subheading,
  features,
  columns = 3,
}: FeaturesGridProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
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

        {/* Features Grid */}
        <div
          className={cn(
            "grid gap-8",
            columns === 2 && "grid-cols-1 md:grid-cols-2",
            columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
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

export default FeaturesGrid;
