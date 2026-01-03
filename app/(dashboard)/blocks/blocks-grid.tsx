import { BlockCard } from "@/components/marketplace";
import { filterBlocks, getAllBlocks } from "@/lib/blocks";
import type { BlockCategory, BlockTier } from "@/lib/supabase/types";
import { Blocks } from "lucide-react";

interface BlocksGridProps {
  category?: string;
  tier?: BlockTier;
  search?: string;
}

export function BlocksGrid({ category, tier, search }: BlocksGridProps) {
  // Get filtered blocks from registry
  const blocks = filterBlocks({
    category: category as BlockCategory | undefined,
    tier,
    search,
  });

  // If no blocks in registry yet, show empty state
  if (blocks.length === 0) {
    return <EmptyState hasFilters={!!(category || tier || search)} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {blocks.map((block) => (
        <BlockCard
          key={block.id}
          block={block}
          viewCount={0}
          copyCount={0}
        />
      ))}
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Blocks className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">
        {hasFilters ? "No blocks found" : "Blocks coming soon"}
      </h3>
      <p className="text-muted-foreground max-w-sm">
        {hasFilters
          ? "Try adjusting your filters or search query to find what you're looking for."
          : "We're working on adding production-ready blocks to the library. Check back soon!"}
      </p>
    </div>
  );
}
