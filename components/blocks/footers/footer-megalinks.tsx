"use client";

import Link from "next/link";

// ============================================
// TYPES
// ============================================

export interface FooterMegaSection {
  title: string;
  links: {
    label: string;
    href: string;
    badge?: string;
  }[];
}

export interface FooterMegalinksProps {
  /** Logo text */
  logo: string;
  /** Logo link destination */
  logoHref?: string;
  /** Company description */
  description?: string;
  /** Main link sections */
  sections: FooterMegaSection[];
  /** Bottom links (legal, etc.) */
  bottomLinks?: {
    label: string;
    href: string;
  }[];
  /** Copyright text */
  copyright?: string;
}

// ============================================
// COMPONENT
// ============================================

export function FooterMegalinks({
  logo,
  logoHref = "/",
  description,
  sections,
  bottomLinks = [],
  copyright = "All rights reserved.",
}: FooterMegalinksProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column - Takes 2 columns on large screens */}
          <div className="col-span-2 lg:col-span-2">
            <Link
              href={logoHref}
              className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
            >
              {logo}
            </Link>
            {description && (
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Link Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
                    >
                      {link.label}
                      {link.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-primary/10 text-primary">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} {logo}. {copyright}
            </p>

            {/* Bottom Links */}
            {bottomLinks.length > 0 && (
              <nav className="flex flex-wrap items-center gap-4 md:gap-6">
                {bottomLinks.map((link, index) => (
                  <span key={link.href} className="flex items-center gap-4 md:gap-6">
                    {index > 0 && (
                      <span className="hidden md:block w-px h-3 bg-border" />
                    )}
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </span>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// DEFAULT EXPORT FOR REGISTRY
// ============================================

export default FooterMegalinks;
