"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineCopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

interface CodeViewerProps {
  /** The source code to display */
  code: string;
  /** The language for syntax highlighting */
  language?: string;
  /** Optional filename to display */
  filename?: string;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  /** Maximum height before collapsing (in lines) */
  maxLines?: number;
  /** Whether to start collapsed */
  startCollapsed?: boolean;
  /** Optional class name */
  className?: string;
  /** Pre-highlighted HTML (for server-rendered code) */
  highlightedHtml?: string;
}

/**
 * CodeViewer Component
 *
 * Displays syntax-highlighted code with line numbers,
 * copy button, and collapsible sections for long code.
 */
export function CodeViewer({
  code,
  language = "tsx",
  filename,
  showLineNumbers = true,
  maxLines = 50,
  startCollapsed = false,
  className,
  highlightedHtml,
}: CodeViewerProps) {
  const [isCollapsed, setIsCollapsed] = useState(startCollapsed);
  const [highlighted, setHighlighted] = useState<string | null>(highlightedHtml ?? null);
  const [isLoading, setIsLoading] = useState(!highlightedHtml);
  const codeRef = useRef<HTMLDivElement>(null);

  const lines = code.split("\n");
  const isLong = lines.length > maxLines;
  const shouldCollapse = isLong && isCollapsed;

  // Client-side syntax highlighting
  useEffect(() => {
    if (highlightedHtml) return;

    let mounted = true;

    async function highlight() {
      try {
        const { codeToHtml } = await import("shiki");
        const html = await codeToHtml(code, {
          lang: language,
          theme: "github-dark-default",
        });

        if (mounted) {
          setHighlighted(html);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to highlight code:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    highlight();

    return () => {
      mounted = false;
    };
  }, [code, language, highlightedHtml]);

  if (isLoading) {
    return <CodeViewerSkeleton lines={Math.min(lines.length, 10)} />;
  }

  return (
    <div
      className={cn(
        "relative rounded-lg border border-border bg-[#0d1117] overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-[#161b22]">
        <div className="flex items-center gap-2">
          <FileCode2 className="h-4 w-4 text-muted-foreground" />
          {filename && (
            <span className="text-sm text-muted-foreground">{filename}</span>
          )}
          <Badge variant="secondary" className="text-xs">
            {language}
          </Badge>
        </div>
        <InlineCopyButton code={code} className="text-gray-400 hover:text-white" />
      </div>

      {/* Code Content */}
      <div
        ref={codeRef}
        className={cn(
          "overflow-x-auto transition-all duration-300",
          shouldCollapse && "max-h-[400px] overflow-hidden"
        )}
      >
        {highlighted ? (
          <div className="relative">
            {showLineNumbers && (
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0d1117] border-r border-border/30 select-none">
                <div className="p-4 text-right text-xs text-gray-500 font-mono leading-6">
                  {(shouldCollapse ? lines.slice(0, maxLines) : lines).map(
                    (_, i) => (
                      <div key={i}>{i + 1}</div>
                    )
                  )}
                </div>
              </div>
            )}
            <div
              className={cn(
                "[&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:overflow-visible",
                "[&_code]:text-sm [&_code]:leading-6 [&_code]:font-mono",
                showLineNumbers && "[&_pre]:pl-16"
              )}
              dangerouslySetInnerHTML={{
                __html: shouldCollapse
                  ? truncateHighlightedCode(highlighted, maxLines)
                  : highlighted,
              }}
            />
          </div>
        ) : (
          <pre className={cn("p-4 text-sm leading-6 font-mono text-gray-300", showLineNumbers && "pl-16")}>
            <code>{shouldCollapse ? lines.slice(0, maxLines).join("\n") : code}</code>
          </pre>
        )}

        {/* Fade overlay when collapsed */}
        {shouldCollapse && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none" />
        )}
      </div>

      {/* Expand/Collapse Button */}
      {isLong && (
        <div className="flex justify-center py-2 border-t border-border/50 bg-[#161b22]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="mr-1 h-4 w-4" />
                Show all {lines.length} lines
              </>
            ) : (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                Show less
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Truncate highlighted HTML to a specific number of lines
 */
function truncateHighlightedCode(html: string, maxLines: number): string {
  // This is a simple approach - count <span> elements containing newlines
  // A more robust solution would parse the HTML properly
  const lines = html.split("\n");
  if (lines.length <= maxLines) return html;

  return lines.slice(0, maxLines).join("\n");
}

/**
 * CodeViewer Skeleton for loading states
 */
export function CodeViewerSkeleton({ lines = 10 }: { lines?: number }) {
  return (
    <div className="rounded-lg border border-border bg-[#0d1117] overflow-hidden">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-[#161b22]">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 bg-gray-700" />
          <Skeleton className="h-4 w-24 bg-gray-700" />
          <Skeleton className="h-5 w-12 bg-gray-700" />
        </div>
        <Skeleton className="h-6 w-6 bg-gray-700" />
      </div>

      {/* Code skeleton */}
      <div className="p-4 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton
              className="h-4 w-8 bg-gray-800"
              style={{ opacity: 0.5 }}
            />
            <Skeleton
              className="h-4 bg-gray-800"
              style={{
                width: `${Math.random() * 50 + 30}%`,
                opacity: 0.5 + Math.random() * 0.3,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
