"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface AlternatingFeature {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  points?: string[];
}

export interface FeaturesAlternatingProps {
  /** Section badge/label */
  badge?: string;
  /** Section heading */
  heading: string;
  /** Section subheading */
  subheading?: string;
  /** Features to display (each alternates side) */
  features: AlternatingFeature[];
}

// ============================================
// COMPONENT
// ============================================

export function FeaturesAlternating({
  badge,
  heading,
  subheading,
  features,
}: FeaturesAlternatingProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
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

        {/* Alternating Features */}
        <div className="space-y-24 md:space-y-32">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center",
                index % 2 === 1 && "lg:flex-row-reverse"
              )}
            >
              {/* Content */}
              <div className={cn(index % 2 === 1 && "lg:order-2")}>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Points */}
                {feature.points && feature.points.length > 0 && (
                  <ul className="space-y-3">
                    {feature.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Image */}
              <div
                className={cn(
                  "relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl",
                  index % 2 === 1 && "lg:order-1"
                )}
              >
                <Image
                  src={feature.image}
                  alt={feature.imageAlt}
                  fill
                  className="object-cover"
                />
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

export default FeaturesAlternating;
