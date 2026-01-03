"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================
// TYPES
// ============================================

export interface NavbarDropdownsProps {
  /** Logo text */
  logo: string;
  /** Logo link destination */
  logoHref?: string;
  /** Navigation items with optional dropdowns */
  items: {
    label: string;
    href?: string;
    children?: {
      label: string;
      href: string;
      description?: string;
    }[];
  }[];
  /** Primary CTA button */
  cta?: {
    label: string;
    href: string;
  };
}

// ============================================
// COMPONENT
// ============================================

export function NavbarDropdowns({
  logo,
  logoHref = "/",
  items,
  cta,
}: NavbarDropdownsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={logoHref}
            className="text-xl font-bold text-foreground hover:text-primary transition-colors"
          >
            {logo}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {items.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children ? (
                  <>
                    <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 pt-2">
                        <div className="w-64 rounded-lg border border-border bg-background shadow-lg py-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 hover:bg-muted transition-colors"
                            >
                              <span className="text-sm font-medium text-foreground">
                                {child.label}
                              </span>
                              {child.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {child.description}
                                </p>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {cta && (
              <Button asChild>
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <div className="space-y-2">
                      <span className="text-sm font-semibold text-foreground px-2">
                        {item.label}
                      </span>
                      <div className="pl-4 space-y-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                            onClick={() => setIsOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              {cta && (
                <Button asChild className="w-full mt-4">
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

export default NavbarDropdowns;
