"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlockTierBadge } from "@/components/subscription/subscription-badge";
import { getCategoryLabel, getCategoryIcon } from "@/lib/blocks/categories";
import type { BlockMeta } from "@/types/block";
import { cn } from "@/lib/utils";

interface BlockCardProps {
  /** Block metadata */
  block: BlockMeta;
  /** View count (from analytics) */
  viewCount?: number;
  /** Copy count (from analytics) */
  copyCount?: number;
  /** Whether the card is clickable */
  clickable?: boolean;
  /** Optional className for the card */
  className?: string;
}

/**
 * BlockCard Component
 *
 * Displays a block in the marketplace grid with preview image,
 * category/tier badges, and usage stats.
 */
export function BlockCard({
  block,
  viewCount = 0,
  copyCount = 0,
  clickable = true,
  className,
}: BlockCardProps) {
  const CategoryIcon = getCategoryIcon(block.category);

  const cardContent = (
    <Card
      hoverable={clickable}
      className={cn(
        "overflow-hidden group",
        className
      )}
    >
      {/* Preview Image */}
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        {block.previewImage ? (
          <Image
            src={block.previewImage}
            alt={`${block.name} preview`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <CategoryIcon className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}

        {/* Tier Badge Overlay */}
        <div className="absolute top-3 right-3">
          <BlockTierBadge tier={block.tier} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            <CategoryIcon className="mr-1 h-3 w-3" />
            {getCategoryLabel(block.category)}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
          {block.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {block.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{formatCount(viewCount)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Copy className="h-3.5 w-3.5" />
            <span>{formatCount(copyCount)}</span>
          </div>
        </div>
      </div>
    </Card>
  );

  if (clickable) {
    return (
      <Link
        href={`/dashboard/blocks/${block.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

/**
 * Format a count number for display
 * 1234 -> "1.2k"
 */
function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}m`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

/**
 * BlockCard Skeleton for loading states
 */
export function BlockCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Preview skeleton */}
      <div className="aspect-[16/10] bg-muted animate-pulse" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-5 w-20 bg-muted rounded animate-pulse" />
        <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
        <div className="flex gap-4">
          <div className="h-4 w-12 bg-muted rounded animate-pulse" />
          <div className="h-4 w-12 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </Card>
  );
}
