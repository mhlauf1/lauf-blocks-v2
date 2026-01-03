"use client";

import Link from "next/link";
import {
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
  type LucideIcon,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

export type SocialPlatform =
  | "twitter"
  | "github"
  | "linkedin"
  | "instagram"
  | "youtube"
  | "facebook";

export interface FooterSocialProps {
  /** Logo text */
  logo: string;
  /** Logo link destination */
  logoHref?: string;
  /** Tagline under logo */
  tagline?: string;
  /** Social media links */
  socials: {
    platform: SocialPlatform;
    href: string;
    label?: string;
  }[];
  /** Navigation links */
  links?: {
    label: string;
    href: string;
  }[];
  /** Copyright text */
  copyright?: string;
}

// ============================================
// HELPERS
// ============================================

const socialIcons: Record<SocialPlatform, LucideIcon> = {
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
};

const socialLabels: Record<SocialPlatform, string> = {
  twitter: "Twitter",
  github: "GitHub",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  youtube: "YouTube",
  facebook: "Facebook",
};

// ============================================
// COMPONENT
// ============================================

export function FooterSocial({
  logo,
  logoHref = "/",
  tagline,
  socials,
  links = [],
  copyright = "All rights reserved.",
}: FooterSocialProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Main Content */}
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Brand */}
          <div className="space-y-2">
            <Link
              href={logoHref}
              className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
            >
              {logo}
            </Link>
            {tagline && (
              <p className="text-sm text-muted-foreground">{tagline}</p>
            )}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socials.map((social) => {
              const Icon = socialIcons[social.platform];
              const label = social.label || socialLabels[social.platform];
              return (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>

          {/* Links */}
          {links.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
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
        </div>

        {/* Copyright */}
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

export default FooterSocial;
