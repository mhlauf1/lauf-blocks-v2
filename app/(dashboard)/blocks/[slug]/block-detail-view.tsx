"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Code, Eye, Package, Copy, Terminal, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BlockPreview,
  CodeViewer,
  CopyButton,
  StyleProvider,
  StyleVisualizer,
} from "@/components/marketplace";
import { useSubscriptionContext } from "@/components/subscription/subscription-provider";
import { trackBlockView, trackCodeCopy } from "@/lib/blocks/analytics-client";
import type { BlockMeta } from "@/types/block";
import { cn } from "@/lib/utils";

interface BlockDetailViewProps {
  block: BlockMeta;
  sourceCode: string;
  cliCommand: string;
  installCommand: string | null;
  relatedBlocks: BlockMeta[];
}

export function BlockDetailView({
  block,
  sourceCode,
  cliCommand,
  installCommand,
  relatedBlocks,
}: BlockDetailViewProps) {
  const [activeTab, setActiveTab] = useState<string>("preview");

  // Get subscription status - may not be available if not wrapped in provider
  let userTier: "free" | "pro" = "free";
  try {
    const subscription = useSubscriptionContext();
    userTier = subscription.tier;
  } catch {
    // Not wrapped in SubscriptionProvider, default to free
  }

  const isProBlock = block.tier === "pro";
  const hasAccess = !isProBlock || userTier === "pro";

  // Track block view on mount
  useEffect(() => {
    trackBlockView(block.slug);
  }, [block.slug]);

  // Handlers for copy tracking
  const handleCodeCopy = () => {
    trackCodeCopy(block.slug, "code");
  };

  const handleCliCopy = () => {
    trackCodeCopy(block.slug, "cli");
  };

  return (
    <StyleProvider>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Style Visualizer */}
          <div className="flex items-center justify-between">
            <StyleVisualizer />
          </div>

          {/* Preview / Code Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="preview">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code">
                <Code className="mr-2 h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-0">
              <Card>
                <CardContent className="p-0">
                  {hasAccess ? (
                    <BlockPreview minHeight={500}>
                      <div className="p-8 text-center text-muted-foreground">
                        <p>Block preview will appear here once blocks are created.</p>
                        <p className="text-sm mt-2">
                          Component: {block.name}
                        </p>
                      </div>
                    </BlockPreview>
                  ) : (
                    <ProAccessGate blockName={block.name} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code" className="mt-0">
              {hasAccess ? (
                <CodeViewer
                  code={sourceCode}
                  filename={`${block.slug}.tsx`}
                  language="tsx"
                />
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <ProAccessGate blockName={block.name} />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Copy Buttons */}
          {hasAccess && (
            <div className="flex items-center gap-3">
              <CopyButton code={sourceCode} mode="code" onCopy={handleCodeCopy} />
              <CopyButton
                code={sourceCode}
                cliCommand={cliCommand}
                mode="cli"
                isProOnly
                userTier={userTier}
                onCopy={handleCliCopy}
              />
            </div>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Dependencies */}
          {block.dependencies.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Dependencies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {block.dependencies.map((dep) => (
                    <Badge key={dep} variant="secondary">
                      {dep}
                    </Badge>
                  ))}
                </div>
                {installCommand && (
                  <div className="relative">
                    <code className="block text-xs bg-muted p-3 rounded-md pr-10 overflow-x-auto">
                      {installCommand}
                    </code>
                    <CopyButton
                      code={installCommand}
                      mode="code"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {hasAccess ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveTab("code")}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy component code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    disabled={userTier === "free"}
                  >
                    <Terminal className="mr-2 h-4 w-4" />
                    Copy CLI command
                    {userTier === "free" && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Pro
                      </Badge>
                    )}
                  </Button>
                </>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/pricing">
                    Upgrade to Pro
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Related Blocks */}
          {relatedBlocks.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Related Blocks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedBlocks.map((related) => (
                  <Link
                    key={related.id}
                    href={`/dashboard/blocks/${related.slug}`}
                    className="block group"
                  >
                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary">
                          {related.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {related.description}
                        </p>
                      </div>
                      <Badge
                        variant={related.tier === "pro" ? "default" : "secondary"}
                        className={cn(
                          "shrink-0",
                          related.tier === "pro" && "bg-amber-500"
                        )}
                      >
                        {related.tier}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </StyleProvider>
  );
}

function ProAccessGate({ blockName }: { blockName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gradient-to-b from-muted/30 to-muted/60">
      <div className="rounded-full bg-amber-100 p-4 mb-4">
        <svg
          className="h-8 w-8 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">Pro Block</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        <strong>{blockName}</strong> is a Pro block. Upgrade to access the full
        source code and preview.
      </p>
      <Button asChild>
        <Link href="/pricing">
          Upgrade to Pro
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
