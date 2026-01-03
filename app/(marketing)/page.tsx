import Link from "next/link";
import { ArrowRight, Blocks, Zap, Code2, DollarSign, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 animate-fade-in">
            <Sparkles className="w-3 h-3 mr-1" />
            Now with AI-powered site generation
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            Build Stunning Sites
            <br />
            <span className="gradient-text">10x Faster</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up">
            1,000+ production-ready React components. Copy-paste into your
            Next.js app. No npm install required. Built for developers who ship.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button size="xl" asChild>
              <Link href="/signup">
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/blocks">Browse Components</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground animate-fade-in">
            Trusted by 10,000+ developers worldwide
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Developers Choose LaufBlocks
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by developers, for developers. Every component is crafted
              with performance, accessibility, and DX in mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">React Native</h3>
              <p className="text-muted-foreground">
                Built for Next.js App Router with React 19 and Server
                Components support out of the box.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Blocks className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Copy-Paste</h3>
              <p className="text-muted-foreground">
                No dependencies to install. Just copy the component code and
                paste it into your project.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100 Lighthouse</h3>
              <p className="text-muted-foreground">
                Every component is optimized for performance. Achieve perfect
                Lighthouse scores by default.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Half the Price</h3>
              <p className="text-muted-foreground">
                Get more components at $19.99/mo. Half the price of competitors
                with better quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-muted-foreground mb-4">
                Perfect for side projects
              </p>
              <div className="text-4xl font-bold mb-6">
                $0<span className="text-lg font-normal">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "50+ Essential Blocks",
                  "1 Site Generation / month",
                  "Copy/Paste Export",
                  "Community Support",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-card rounded-xl p-8 border-2 border-primary relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-muted-foreground mb-4">
                For professional developers
              </p>
              <div className="text-4xl font-bold mb-6">
                $19.99<span className="text-lg font-normal">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "1,000+ Premium Blocks",
                  "Unlimited Site Generations",
                  "ZIP & CLI Export",
                  "Priority Support",
                  "3 Style Themes",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" asChild>
                <Link href="/signup?plan=pro">Upgrade to Pro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of developers building faster with LaufBlocks. Start
            free, no credit card required.
          </p>
          <Button size="xl" variant="secondary" asChild>
            <Link href="/signup">
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
