import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Block Library",
  description: "Browse 1,000+ production-ready React components",
};

export default function BlocksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Block Library</h1>
        <p className="text-muted-foreground mt-1">
          Browse and copy production-ready components for your projects.
        </p>
      </div>

      <div className="text-center py-24 text-muted-foreground">
        <p>Block library coming soon...</p>
      </div>
    </div>
  );
}
