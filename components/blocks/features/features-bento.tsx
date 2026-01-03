"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface BentoFeature {
  icon?: LucideIcon;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  /** Grid span: small (1x1), medium (2x1), large (2x2) */
  size?: "small" | "medium" | "large";
}

export interface FeaturesBentoProps {
  /** Section badge/label */
  badge?: string;
  /** Section heading */
  heading: string;
  /** Section subheading */
  subheading?: string;
  /** Features to display in bento grid */
  features: BentoFeature[];
}

// ============================================
// COMPONENT
// ============================================

export function FeaturesBento({
  badge,
  heading,
  subheading,
  features,
}: FeaturesBentoProps) {
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

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "relative group rounded-2xl border border-border bg-card overflow-hidden",
                "hover:border-primary/50 hover:shadow-lg transition-all duration-300",
                feature.size === "small" && "col-span-1 row-span-1",
                feature.size === "medium" && "col-span-1 md:col-span-2 row-span-1",
                feature.size === "large" && "col-span-1 md:col-span-2 row-span-2",
                !feature.size && "col-span-1 row-span-1"
              )}
            >
              {/* Image Background */}
              {feature.image && (
                <div className="absolute inset-0">
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt || feature.title}
                    fill
                    className="object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                </div>
              )}

              {/* Content */}
              <div
                className={cn(
                  "relative p-6 h-full flex flex-col",
                  feature.size === "large" && "p-8"
                )}
              >
                {/* Icon */}
                {feature.icon && (
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4">
                    <feature.icon className="w-5 h-5" />
                  </div>
                )}

                <div className="mt-auto">
                  {/* Title */}
                  <h3
                    className={cn(
                      "font-semibold text-foreground mb-2",
                      feature.size === "large" ? "text-xl" : "text-lg"
                    )}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={cn(
                      "text-muted-foreground leading-relaxed",
                      feature.size === "large" ? "text-base" : "text-sm"
                    )}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
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

export default FeaturesBento;
