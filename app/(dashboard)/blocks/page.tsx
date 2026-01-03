import type { Metadata } from "next";
import { Suspense } from "react";
import { BlocksGrid } from "./blocks-grid";
import { BlocksFilters } from "./blocks-filters";
import { BlockCardSkeleton } from "@/components/marketplace";

export const metadata: Metadata = {
  title: "Block Library",
  description: "Browse 1,000+ production-ready React components",
};

interface BlocksPageProps {
  searchParams: Promise<{
    category?: string;
    tier?: string;
    q?: string;
  }>;
}

export default async function BlocksPage({ searchParams }: BlocksPageProps) {
  const params = await searchParams;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 shrink-0">
        <BlocksFilters
          selectedCategory={params.category}
          selectedTier={params.tier as "free" | "pro" | undefined}
          searchQuery={params.q}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Block Library</h1>
            <p className="text-muted-foreground mt-1">
              Browse and copy production-ready components for your projects.
            </p>
          </div>

          {/* Blocks Grid */}
          <Suspense fallback={<BlocksGridSkeleton />}>
            <BlocksGrid
              category={params.category}
              tier={params.tier as "free" | "pro" | undefined}
              search={params.q}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function BlocksGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <BlockCardSkeleton key={i} />
      ))}
    </div>
  );
}
