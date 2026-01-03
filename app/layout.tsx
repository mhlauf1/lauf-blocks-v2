import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LaufBlocks - Premium React Component Library",
    template: "%s | LaufBlocks",
  },
  description:
    "Build stunning websites faster with 1,000+ production-ready React components. Copy-paste, don't npm install. Built for Next.js App Router.",
  keywords: [
    "React components",
    "Next.js",
    "Tailwind CSS",
    "UI library",
    "component library",
    "landing pages",
    "web development",
  ],
  authors: [{ name: "LaufBlocks" }],
  creator: "LaufBlocks",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "LaufBlocks - Premium React Component Library",
    description:
      "Build stunning websites faster with 1,000+ production-ready React components.",
    siteName: "LaufBlocks",
  },
  twitter: {
    card: "summary_large_image",
    title: "LaufBlocks - Premium React Component Library",
    description:
      "Build stunning websites faster with 1,000+ production-ready React components.",
    creator: "@laufblocks",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
