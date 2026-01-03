"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface MegaMenuSection {
  title: string;
  links: {
    label: string;
    href: string;
    description?: string;
    icon?: React.ReactNode;
  }[];
}

export interface NavbarMegamenuProps {
  /** Logo text */
  logo: string;
  /** Logo link destination */
  logoHref?: string;
  /** Navigation items */
  items: {
    label: string;
    href?: string;
    megaMenu?: {
      sections: MegaMenuSection[];
      featured?: {
        title: string;
        description: string;
        href: string;
        image?: string;
      };
    };
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

export function NavbarMegamenu({
  logo,
  logoHref = "/",
  items,
  cta,
}: NavbarMegamenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
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
          <div className="hidden lg:flex items-center gap-1">
            {items.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.megaMenu && setActiveMegaMenu(item.label)}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                {item.megaMenu ? (
                  <button
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-md",
                      activeMegaMenu === item.label
                        ? "text-foreground bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        activeMegaMenu === item.label && "rotate-180"
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {cta && (
              <Button asChild>
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* Mega Menu Dropdown */}
      {items.map((item) =>
        item.megaMenu && activeMegaMenu === item.label ? (
          <div
            key={item.label}
            className="hidden lg:block absolute left-0 right-0 top-full border-b border-border bg-background shadow-lg"
            onMouseEnter={() => setActiveMegaMenu(item.label)}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Sections */}
                <div className="col-span-9 grid grid-cols-3 gap-8">
                  {item.megaMenu.sections.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                        {section.title}
                      </h3>
                      <ul className="space-y-3">
                        {section.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="group flex items-start gap-3 p-2 -m-2 rounded-lg hover:bg-muted transition-colors"
                            >
                              {link.icon && (
                                <span className="mt-0.5 text-muted-foreground group-hover:text-primary transition-colors">
                                  {link.icon}
                                </span>
                              )}
                              <div>
                                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                  {link.label}
                                </span>
                                {link.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {link.description}
                                  </p>
                                )}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Featured */}
                {item.megaMenu.featured && (
                  <div className="col-span-3">
                    <div className="rounded-xl bg-muted p-6">
                      <h3 className="text-sm font-semibold text-foreground mb-2">
                        {item.megaMenu.featured.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        {item.megaMenu.featured.description}
                      </p>
                      <Link
                        href={item.megaMenu.featured.href}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Learn more
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null
      )}

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <div key={item.label}>
                  {item.megaMenu ? (
                    <div className="space-y-2">
                      <span className="text-sm font-semibold text-foreground block py-2">
                        {item.label}
                      </span>
                      {item.megaMenu.sections.map((section) => (
                        <div key={section.title} className="pl-4">
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block py-1">
                            {section.title}
                          </span>
                          <div className="space-y-1">
                            {section.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="block text-sm text-muted-foreground hover:text-foreground py-1"
                                onClick={() => setIsOpen(false)}
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2"
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
        </div>
      )}
    </header>
  );
}

// ============================================
// DEFAULT EXPORT FOR REGISTRY
// ============================================

export default NavbarMegamenu;
