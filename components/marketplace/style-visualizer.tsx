"use client";

import { Paintbrush } from "lucide-react";
import type { BlockStyle } from "@/lib/supabase/types";
import { THEMES, getAllStyles } from "@/lib/blocks/themes";
import { useStyle } from "./style-provider";
import { cn } from "@/lib/utils";

interface StyleVisualizerProps {
  /** Optional className for the container */
  className?: string;
  /** Size variant */
  size?: "sm" | "default";
  /** Whether to show labels */
  showLabels?: boolean;
  /** Whether to show the icon */
  showIcon?: boolean;
}

/**
 * StyleVisualizer Component
 *
 * A toggle control for switching between the 3 DNA styles:
 * Minimalist, High-Brand, and Neo-Industrial.
 */
export function StyleVisualizer({
  className,
  size = "default",
  showLabels = true,
  showIcon = true,
}: StyleVisualizerProps) {
  const { currentStyle, setStyle } = useStyle();
  const styles = getAllStyles();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 p-1 bg-muted rounded-lg",
        className
      )}
    >
      {showIcon && (
        <Paintbrush className={cn("text-muted-foreground ml-2", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
      )}

      {styles.map((style) => (
        <StyleButton
          key={style}
          style={style}
          isActive={currentStyle === style}
          onClick={() => setStyle(style)}
          size={size}
          showLabel={showLabels}
        />
      ))}
    </div>
  );
}

interface StyleButtonProps {
  style: BlockStyle;
  isActive: boolean;
  onClick: () => void;
  size: "sm" | "default";
  showLabel: boolean;
}

function StyleButton({
  style,
  isActive,
  onClick,
  size,
  showLabel,
}: StyleButtonProps) {
  const theme = THEMES[style];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md transition-all",
        size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
      title={theme.description}
    >
      <StyleIndicator style={style} size={size} />
      {showLabel && <span className="font-medium">{theme.name}</span>}
    </button>
  );
}

/**
 * Visual indicator dot showing the style's color scheme
 */
interface StyleIndicatorProps {
  style: BlockStyle;
  size: "sm" | "default";
}

function StyleIndicator({ style, size }: StyleIndicatorProps) {
  const dotSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  // Color indicators for each style
  const styleColors: Record<BlockStyle, string> = {
    minimalist: "bg-gradient-to-br from-zinc-300 to-zinc-400",
    high_brand: "bg-gradient-to-br from-purple-500 to-blue-500",
    neo_industrial: "bg-gradient-to-br from-zinc-900 to-yellow-500",
  };

  return (
    <div
      className={cn("rounded-full", dotSize, styleColors[style])}
      aria-hidden="true"
    />
  );
}

/**
 * Compact style toggle for tight spaces
 */
interface CompactStyleToggleProps {
  className?: string;
}

export function CompactStyleToggle({ className }: CompactStyleToggleProps) {
  return (
    <StyleVisualizer
      size="sm"
      showLabels={false}
      showIcon={false}
      className={className}
    />
  );
}

/**
 * Style selector as dropdown menu (for even tighter spaces)
 */
export function StyleDropdown({ className }: { className?: string }) {
  const { currentStyle, setStyle } = useStyle();
  const styles = getAllStyles();

  return (
    <div className={cn("relative", className)}>
      <select
        value={currentStyle}
        onChange={(e) => setStyle(e.target.value as BlockStyle)}
        className="appearance-none bg-muted text-foreground px-3 py-1.5 pr-8 rounded-md text-sm font-medium border border-border focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
      >
        {styles.map((style) => (
          <option key={style} value={style}>
            {THEMES[style].name}
          </option>
        ))}
      </select>
      <Paintbrush className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}
