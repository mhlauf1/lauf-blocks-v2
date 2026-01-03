import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Stay up to date with the latest LaufBlocks updates and improvements.",
};

export default function ChangelogPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Changelog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay up to date with the latest updates and improvements to LaufBlocks.
        </p>
      </div>

      <div className="text-center text-muted-foreground">
        <p>Changelog coming soon...</p>
      </div>
    </div>
  );
}
