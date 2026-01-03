import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlockTierBadge } from "@/components/subscription/subscription-badge";
import {
  getBlock,
  getRelatedBlocks,
  loadBlockSource,
  getDependencyInstallCommand,
  getCliCommand,
  getCategoryLabel,
} from "@/lib/blocks";
import { BlockDetailView } from "./block-detail-view";

interface BlockDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlockDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const block = getBlock(slug);

  if (!block) {
    return {
      title: "Block Not Found",
    };
  }

  return {
    title: block.name,
    description: block.description,
    openGraph: {
      title: block.name,
      description: block.description,
      images: block.previewImage ? [block.previewImage] : undefined,
    },
  };
}

export default async function BlockDetailPage({ params }: BlockDetailPageProps) {
  const { slug } = await params;
  const block = getBlock(slug);

  if (!block) {
    notFound();
  }

  // Load source code
  const sourceCode = await loadBlockSource(slug);
  const relatedBlocks = getRelatedBlocks(slug, 4);
  const installCommand = getDependencyInstallCommand(block);
  const cliCommand = getCliCommand(slug);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard/blocks"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to blocks
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{block.name}</h1>
              <BlockTierBadge tier={block.tier} />
            </div>
            <p className="text-muted-foreground max-w-2xl">{block.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary">{getCategoryLabel(block.category)}</Badge>
              {block.styles.map((style) => (
                <Badge key={style} variant="outline" className="capitalize">
                  {style.replace("_", "-")}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Block Detail View (Client Component) */}
      <BlockDetailView
        block={block}
        sourceCode={sourceCode ?? "// Source code not available"}
        cliCommand={cliCommand}
        installCommand={installCommand}
        relatedBlocks={relatedBlocks}
      />
    </div>
  );
}
