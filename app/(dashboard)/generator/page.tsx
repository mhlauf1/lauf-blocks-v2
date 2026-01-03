import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Site Generator",
  description: "Generate complete site structures with AI",
};

export default function GeneratorPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Site Generator</h1>
        <p className="text-muted-foreground mt-1">
          Describe your project and let AI generate a complete component structure.
        </p>
      </div>

      <div className="text-center py-24 text-muted-foreground">
        <p>AI Generator coming soon...</p>
      </div>
    </div>
  );
}
