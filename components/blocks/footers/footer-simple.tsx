"use client";

import Link from "next/link";

// ============================================
// TYPES
// ============================================

export interface FooterSimpleProps {
  /** Logo text */
  logo: string;
  /** Logo link destination */
  logoHref?: string;
  /** Copyright text (use {year} for current year) */
  copyright?: string;
  /** Quick links */
  links?: {
    label: string;
    href: string;
  }[];
}

// ============================================
// COMPONENT
// ============================================

export function FooterSimple({
  logo,
  logoHref = "/",
  copyright = "All rights reserved.",
  links = [],
}: FooterSimpleProps) {
  const currentYear = new Date().getFullYear();
  const formattedCopyright = copyright.replace("{year}", String(currentYear));

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={logoHref}
            className="text-lg font-bold text-foreground hover:text-primary transition-colors"
          >
            {logo}
          </Link>

          {/* Quick Links */}
          {links.length > 0 && (
            <nav className="flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {logo}. {formattedCopyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// DEFAULT EXPORT FOR REGISTRY
// ============================================

export default FooterSimple;
