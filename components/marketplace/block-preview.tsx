"use client";

import { useState, useRef, useEffect } from "react";
import { Monitor, Tablet, Smartphone, RefreshCw, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ViewportSize = "desktop" | "tablet" | "mobile";

interface ViewportConfig {
  width: number;
  icon: typeof Monitor;
  label: string;
}

const VIEWPORTS: Record<ViewportSize, ViewportConfig> = {
  desktop: { width: 1280, icon: Monitor, label: "Desktop" },
  tablet: { width: 768, icon: Tablet, label: "Tablet" },
  mobile: { width: 375, icon: Smartphone, label: "Mobile" },
};

interface BlockPreviewProps {
  /** The block component to render */
  children: React.ReactNode;
  /** Optional class name for the container */
  className?: string;
  /** Initial viewport size */
  defaultViewport?: ViewportSize;
  /** Whether to show viewport controls */
  showControls?: boolean;
  /** Minimum height for the preview */
  minHeight?: number;
  /** Whether the preview is loading */
  isLoading?: boolean;
}

/**
 * BlockPreview Component
 *
 * Renders a block component in an isolated container with
 * viewport size controls for responsive preview.
 *
 * Note: For full isolation, blocks should be rendered in an iframe.
 * This component provides a simpler container-based approach.
 */
export function BlockPreview({
  children,
  className,
  defaultViewport = "desktop",
  showControls = true,
  minHeight = 400,
  isLoading = false,
}: BlockPreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>(defaultViewport);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate scale to fit content in container
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const targetWidth = VIEWPORTS[viewport].width;

      // Scale down if content is wider than container
      if (targetWidth > containerWidth) {
        setScale(containerWidth / targetWidth);
      } else {
        setScale(1);
      }
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [viewport]);

  const handleRefresh = () => {
    // Force re-render by updating key
    if (contentRef.current) {
      contentRef.current.style.opacity = "0";
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.opacity = "1";
        }
      }, 100);
    }
  };

  if (isLoading) {
    return <BlockPreviewSkeleton minHeight={minHeight} />;
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
          {/* Viewport Toggle */}
          <div className="flex items-center gap-1">
            {(Object.entries(VIEWPORTS) as [ViewportSize, ViewportConfig][]).map(
              ([key, config]) => {
                const Icon = config.icon;
                return (
                  <Button
                    key={key}
                    variant={viewport === key ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewport(key)}
                    title={config.label}
                    className="h-8 w-8 p-0"
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              }
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              title="Refresh preview"
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Fullscreen"
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Preview Container */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden bg-[url('/grid.svg')] bg-muted/10"
        style={{ minHeight }}
      >
        {/* Scaled Content */}
        <div
          ref={contentRef}
          className="mx-auto origin-top bg-background shadow-lg transition-all duration-300"
          style={{
            width: VIEWPORTS[viewport].width,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * BlockPreview Skeleton for loading states
 */
export function BlockPreviewSkeleton({ minHeight = 400 }: { minHeight?: number }) {
  return (
    <div className="flex flex-col">
      {/* Controls skeleton */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Preview skeleton */}
      <div
        className="flex items-center justify-center bg-muted/10"
        style={{ minHeight }}
      >
        <div className="text-center space-y-3">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <Skeleton className="h-4 w-56 mx-auto" />
        </div>
      </div>
    </div>
  );
}

/**
 * IframeBlockPreview Component
 *
 * Renders a block in a fully isolated iframe.
 * Use this for complete style isolation.
 */
interface IframeBlockPreviewProps {
  /** HTML content to render in the iframe */
  html: string;
  /** CSS to inject into the iframe */
  css?: string;
  /** Viewport size */
  viewport?: ViewportSize;
  /** Minimum height */
  minHeight?: number;
  /** Class name for container */
  className?: string;
}

export function IframeBlockPreview({
  html,
  css = "",
  viewport = "desktop",
  minHeight = 400,
  className,
}: IframeBlockPreviewProps) {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const targetWidth = VIEWPORTS[viewport].width;

      if (targetWidth > containerWidth) {
        setScale(containerWidth / targetWidth);
      } else {
        setScale(1);
      }
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [viewport]);

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: system-ui, sans-serif; }
          ${css}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden bg-muted/10", className)}
      style={{ minHeight }}
    >
      <iframe
        srcDoc={srcDoc}
        className="border-0 origin-top mx-auto block bg-background shadow-lg"
        style={{
          width: VIEWPORTS[viewport].width,
          height: "100%",
          minHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
        title="Block Preview"
        sandbox="allow-scripts"
      />
    </div>
  );
}
