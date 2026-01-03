"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface NavbarTransparentProps {
  /** Logo text */
  logo: string;
  /** Logo link destination */
  logoHref?: string;
  /** Navigation links */
  links: {
    label: string;
    href: string;
  }[];
  /** Primary CTA button */
  cta?: {
    label: string;
    href: string;
  };
  /** Scroll threshold to trigger background (in pixels) */
  scrollThreshold?: number;
}

// ============================================
// COMPONENT
// ============================================

export function NavbarTransparent({
  logo,
  logoHref = "/",
  links,
  cta,
  scrollThreshold = 50,
}: NavbarTransparentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={logoHref}
            className={cn(
              "text-xl font-bold transition-colors",
              isScrolled
                ? "text-foreground hover:text-primary"
                : "text-white hover:text-white/80"
            )}
          >
            {logo}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isScrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/80 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {cta && (
              <Button
                asChild
                variant={isScrolled ? "default" : "outline"}
                className={cn(
                  !isScrolled && "border-white/30 text-white hover:bg-white/10"
                )}
              >
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "md:hidden p-2 transition-colors",
              isScrolled
                ? "text-muted-foreground hover:text-foreground"
                : "text-white/80 hover:text-white"
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {cta && (
                <Button asChild className="w-full mt-2">
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// ============================================
// DEFAULT EXPORT FOR REGISTRY
// ============================================

export default NavbarTransparent;
