"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================
// TYPES
// ============================================

export interface FooterNewsletterProps {
  /** Logo text */
  logo: string;
  /** Logo link destination */
  logoHref?: string;
  /** Newsletter heading */
  newsletterTitle?: string;
  /** Newsletter description */
  newsletterDescription?: string;
  /** Placeholder text for email input */
  inputPlaceholder?: string;
  /** Button text */
  buttonText?: string;
  /** Navigation links */
  links?: {
    label: string;
    href: string;
  }[];
  /** Submit handler */
  onSubmit?: (email: string) => Promise<void>;
  /** Copyright text */
  copyright?: string;
}

// ============================================
// COMPONENT
// ============================================

export function FooterNewsletter({
  logo,
  logoHref = "/",
  newsletterTitle = "Subscribe to our newsletter",
  newsletterDescription = "Get the latest updates and news delivered to your inbox.",
  inputPlaceholder = "Enter your email",
  buttonText = "Subscribe",
  links = [],
  onSubmit,
  copyright = "All rights reserved.",
}: FooterNewsletterProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      setIsSubmitted(true);
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Brand & Newsletter */}
          <div className="space-y-6">
            <Link
              href={logoHref}
              className="text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              {logo}
            </Link>

            <div className="max-w-md">
              <h3 className="text-lg font-semibold text-foreground">
                {newsletterTitle}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {newsletterDescription}
              </p>

              {isSubmitted ? (
                <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-primary font-medium">
                    Thanks for subscribing!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={inputPlaceholder}
                      required
                      className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Links */}
          {links.length > 0 && (
            <div className="flex flex-wrap gap-x-8 gap-y-4 lg:justify-end lg:items-start">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
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

export default FooterNewsletter;
