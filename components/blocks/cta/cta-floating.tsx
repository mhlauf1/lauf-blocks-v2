"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface CtaFloatingProps {
  /** Main message */
  message: string;
  /** Button text */
  buttonText: string;
  /** Button link */
  buttonHref: string;
  /** Allow dismissal */
  dismissible?: boolean;
  /** Delay before showing (in ms) */
  showDelay?: number;
  /** Position */
  position?: "bottom" | "top";
  /** Storage key for dismissed state */
  storageKey?: string;
}

// ============================================
// COMPONENT
// ============================================

export function CtaFloating({
  message,
  buttonText,
  buttonHref,
  dismissible = true,
  showDelay = 2000,
  position = "bottom",
  storageKey = "cta-floating-dismissed",
}: CtaFloatingProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if previously dismissed
    if (dismissible && typeof window !== "undefined") {
      const dismissed = localStorage.getItem(storageKey);
      if (dismissed === "true") {
        setIsDismissed(true);
        return;
      }
    }

    // Show after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);

    return () => clearTimeout(timer);
  }, [dismissible, showDelay, storageKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, "true");
    }
  };

  if (isDismissed) return null;

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-50 transition-transform duration-500",
        position === "bottom" ? "bottom-0" : "top-0",
        isVisible
          ? "translate-y-0"
          : position === "bottom"
            ? "translate-y-full"
            : "-translate-y-full"
      )}
    >
      <div className="bg-primary shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Message */}
            <p className="text-sm md:text-base text-primary-foreground font-medium">
              {message}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <Button
                size="sm"
                variant="secondary"
                asChild
                className="hidden sm:inline-flex"
              >
                <Link href={buttonHref}>
                  {buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {/* Mobile button */}
              <Button
                size="sm"
                variant="secondary"
                asChild
                className="sm:hidden"
              >
                <Link href={buttonHref}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              {/* Dismiss */}
              {dismissible && (
                <button
                  onClick={handleDismiss}
                  className="p-1 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DEFAULT EXPORT FOR REGISTRY
// ============================================

export default CtaFloating;
