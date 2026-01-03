"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useCallback } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getAllCategories,
  type CategoryMeta,
} from "@/lib/blocks/categories";
import type { BlockCategory, BlockTier } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

interface BlocksFiltersProps {
  selectedCategory?: string;
  selectedTier?: BlockTier;
  searchQuery?: string;
}

export function BlocksFilters({
  selectedCategory,
  selectedTier,
  searchQuery,
}: BlocksFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchQuery ?? "");
  const categories = getAllCategories();

  const updateFilters = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      startTransition(() => {
        router.push(`/dashboard/blocks?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: search || undefined });
  };

  const handleCategoryClick = (category: BlockCategory | undefined) => {
    updateFilters({ category });
  };

  const handleTierClick = (tier: BlockTier | undefined) => {
    updateFilters({ tier });
  };

  const clearFilters = () => {
    setSearch("");
    startTransition(() => {
      router.push("/dashboard/blocks");
    });
  };

  const hasFilters = selectedCategory || selectedTier || searchQuery;

  const filterContent = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-sm font-medium mb-3">Search</h3>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blocks..."
            className="pl-9 pr-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                updateFilters({ q: undefined });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      <Separator />

      {/* Tier Filter */}
      <div>
        <h3 className="text-sm font-medium mb-3">Tier</h3>
        <div className="flex gap-2">
          <Button
            variant={!selectedTier ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleTierClick(undefined)}
            disabled={isPending}
          >
            All
          </Button>
          <Button
            variant={selectedTier === "free" ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleTierClick("free")}
            disabled={isPending}
          >
            Free
          </Button>
          <Button
            variant={selectedTier === "pro" ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleTierClick("pro")}
            disabled={isPending}
            className={selectedTier === "pro" ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : ""}
          >
            Pro
          </Button>
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium mb-3">Categories</h3>
        <div className="space-y-1">
          <CategoryButton
            label="All Categories"
            isActive={!selectedCategory}
            onClick={() => handleCategoryClick(undefined)}
            disabled={isPending}
          />
          {categories.map((cat) => (
            <CategoryButton
              key={cat.id}
              category={cat}
              isActive={selectedCategory === cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              disabled={isPending}
            />
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <>
          <Separator />
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={isPending}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Clear all filters
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-4">
        <div className="rounded-lg border border-border bg-card p-4">
          {filterContent}
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {hasFilters && (
                <Badge variant="secondary" className="ml-2">
                  {[selectedCategory, selectedTier, searchQuery].filter(Boolean)
                    .length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">{filterContent}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

interface CategoryButtonProps {
  category?: CategoryMeta;
  label?: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
}

function CategoryButton({
  category,
  label,
  isActive,
  onClick,
  disabled,
}: CategoryButtonProps) {
  const Icon = category?.icon;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{label ?? category?.label}</span>
    </button>
  );
}
