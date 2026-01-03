"use client";

import Link from "next/link";

// ============================================
// TYPES
// ============================================

export interface FooterColumn {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

export interface FooterColumnsProps {
  /** Logo text */
  logo: string;
  /** Logo link destination */
  logoHref?: string;
  /** Short company description */
  description?: string;
  /** Navigation columns */
  columns: FooterColumn[];
  /** Copyright text */
  copyright?: string;
}

// ============================================
// COMPONENT
// ============================================

export function FooterColumns({
  logo,
  logoHref = "/",
  description,
  columns,
  copyright = "All rights reserved.",
}: FooterColumnsProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link
              href={logoHref}
              className="text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              {logo}
            </Link>
            {description && (
              <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                {description}
              </p>
            )}
          </div>

          {/* Link Columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {currentYear} {logo}. {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// DEFAULT EXPORT FOR REGISTRY
// ============================================

export default FooterColumns;
