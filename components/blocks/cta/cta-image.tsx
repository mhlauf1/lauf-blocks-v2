"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface CtaImageProps {
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
  /** Image source */
  imageSrc: string;
  /** Image alt text */
  imageAlt: string;
  /** Reverse the layout (image on right) */
  reversed?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function CtaImage({
  headline,
  description,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
  reversed = false,
}: CtaImageProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className={cn(reversed && "lg:order-2")}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {headline}
            </h2>

            {description && (
              <p className="mt-4 text-lg text-muted-foreground">{description}</p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
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

          {/* Image */}
          <div
            className={cn(
              "relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl",
              reversed && "lg:order-1"
            )}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// DEFAULT EXPORT FOR REGISTRY
// ============================================

export default CtaImage;
