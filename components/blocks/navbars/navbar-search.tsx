"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface NavbarSearchProps {
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
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Search submit handler */
  onSearch?: (query: string) => void;
  /** Show keyboard shortcut hint */
  showShortcut?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function NavbarSearch({
  logo,
  logoHref = "/",
  links,
  cta,
  searchPlaceholder = "Search...",
  onSearch,
  showShortcut = true,
}: NavbarSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <nav className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href={logoHref}
              className="text-xl font-bold text-foreground hover:text-primary transition-colors shrink-0"
            >
              {logo}
            </Link>

            {/* Desktop Search Bar */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 w-64 lg:w-96 h-9 px-3 rounded-md border border-input bg-background text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">{searchPlaceholder}</span>
              {showShortcut && (
                <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
                  <Command className="h-3 w-3" />K
                </kbd>
              )}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
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

            {/* Mobile Buttons */}
            <div className="flex md:hidden items-center gap-2">
              <button
                className="p-2 text-muted-foreground hover:text-foreground"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                className="p-2 text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </nav>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-border">
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

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="fixed left-1/2 top-1/4 -translate-x-1/2 w-full max-w-xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="relative rounded-lg border border-border bg-background shadow-2xl"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-14 pl-12 pr-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                ESC
              </button>
            </form>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Press Enter to search
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================
// DEFAULT EXPORT FOR REGISTRY
// ============================================

export default NavbarSearch;
