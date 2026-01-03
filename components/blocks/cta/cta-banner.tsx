"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================
// TYPES
// ============================================

export interface CtaBannerProps {
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
  /** Background variant */
  variant?: "default" | "primary" | "dark";
}

// ============================================
// COMPONENT
// ============================================

export function CtaBanner({
  headline,
  description,
  primaryCta,
  secondaryCta,
  variant = "primary",
}: CtaBannerProps) {
  const variants = {
    default: {
      bg: "bg-muted",
      heading: "text-foreground",
      text: "text-muted-foreground",
      primary: "default",
      secondary: "outline",
    },
    primary: {
      bg: "bg-primary",
      heading: "text-primary-foreground",
      text: "text-primary-foreground/80",
      primary: "secondary",
      secondary: "ghost",
    },
    dark: {
      bg: "bg-zinc-900 dark:bg-zinc-800",
      heading: "text-white",
      text: "text-zinc-300",
      primary: "default",
      secondary: "outline",
    },
  } as const;

  const styles = variants[variant];

  return (
    <section className="py-0">
      <div className="container mx-auto px-4">
        <div
          className={`${styles.bg} rounded-2xl px-6 py-12 md:px-12 md:py-16`}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h2
                className={`text-2xl md:text-3xl lg:text-4xl font-bold ${styles.heading}`}
              >
                {headline}
              </h2>
              {description && (
                <p className={`mt-3 text-lg ${styles.text}`}>{description}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Button
                size="lg"
                variant={styles.primary as "default" | "secondary"}
                asChild
                className={
                  variant === "dark"
                    ? "bg-white text-zinc-900 hover:bg-zinc-100"
                    : ""
                }
              >
                <Link href={primaryCta.href}>
                  {primaryCta.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {secondaryCta && (
                <Button
                  size="lg"
                  variant={styles.secondary as "outline" | "ghost"}
                  asChild
                  className={
                    variant === "primary"
                      ? "text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10"
                      : variant === "dark"
                        ? "text-white border-white/30 hover:bg-white/10"
                        : ""
                  }
                >
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// DEFAULT EXPORT FOR REGISTRY
// ============================================

export default CtaBanner;
