import Link from "next/link";
import { Blocks } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple header with logo */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Blocks className="h-7 w-7 text-primary" />
            <span className="font-bold text-lg tracking-tight">LaufBlocks</span>
          </Link>
        </div>
      </header>

      {/* Auth content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Simple footer */}
      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} LaufBlocks. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
