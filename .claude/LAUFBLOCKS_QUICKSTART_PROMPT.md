# LaufBlocks V2 — Claude Code Quick Start Prompt

Paste this directly into Claude Code after setting up MCP servers.

---

## INITIAL SETUP (Run First)

```bash
# 1. Install MCP servers
claude mcp add supabase
claude mcp add playwright

# 2. Verify they're active
claude mcp list
```

---

## THE PROMPT (Paste into Claude Code)

```
I'm building LaufBlocks V2, a premium React/Next.js component library and marketplace. Read the full specification at LAUFBLOCKS_V2_CLAUDE_CODE_SPEC.md in this directory.

## YOUR MISSION

Build LaufBlocks from scratch to fully deployed. Use task sub-agents for parallel execution where possible.

## TECH STACK (Non-negotiable)
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS 4.0
- Radix UI + Framer Motion
- Supabase (Auth + DB)
- Stripe ($19.99/mo Pro tier)
- Playwright for E2E testing

## EXECUTION PROTOCOL

For EACH implementation task:
1. Create a task sub-agent to handle the work
2. After completion: `npm run build` (must pass)
3. Then: `npm run test:e2e` (must pass)
4. If failures, iterate until green
5. Mark complete, proceed to next

## PHASE 1 TASKS (Do These First)

Create a todolist and execute sequentially:

[ ] Initialize Next.js 15 + TypeScript strict + Tailwind 4.0
[ ] Set up path aliases (@/components, @/lib, @/hooks, @/types)
[ ] Install core deps: radix-ui, framer-motion, lucide-react, clsx, tailwind-merge
[ ] Configure Supabase clients (browser + server + middleware)
[ ] Run database migrations (schema in spec: profiles, subscriptions, blocks, etc.)
[ ] Build base UI components (Button, Input, Card, Badge, etc.)
[ ] Build navigation UI (Sheet, DropdownMenu, Dialog)
[ ] Create app layouts (root, marketing, dashboard, auth)
[ ] Implement Supabase auth (login, signup, OAuth, callback)
[ ] Create protected route wrapper
[ ] Set up Stripe (checkout session, customer portal, webhook handler)
[ ] Create useSubscription hook
[ ] Set up Playwright with initial smoke tests

After Phase 1, continue with Phases 2-5 from the spec.

## KEY DIFFERENTIATORS TO MAINTAIN

1. **Logic-Included**: Blocks have real functionality (Zod validation, scroll-lock, etc.)
2. **SEO Pre-baked**: Hero blocks include JSON-LD schemas
3. **No Package Bloat**: Copy-paste philosophy, no npm install required for blocks
4. **Style Visualizer**: 3 DNA styles (Minimalist, High-Brand, Neo-Industrial)
5. **Performance**: Target 100 Lighthouse score

## DATABASE QUICK REFERENCE

Tables needed:
- profiles (extends auth.users)
- subscriptions (free/pro tiers)
- blocks (source_code, category, tier, etc.)
- block_variants (3 styles per block)
- site_generations (AI generator outputs)
- generation_usage (rate limiting free tier)
- block_analytics (views, copies)

## START NOW

Begin with TASK-001: Initialize the Next.js project. Create a comprehensive todolist first, then execute each task with a sub-agent. Verify builds and tests pass after each task.

GO!
```

---

## FILE STRUCTURE REFERENCE

```
laufblocks/
├── app/
│   ├── (auth)/login, signup, callback
│   ├── (marketing)/page, pricing, changelog
│   ├── (dashboard)/dashboard, blocks, generator, settings
│   └── api/webhooks/stripe, generate, blocks
├── components/
│   ├── ui/          (Shadcn-style primitives)
│   ├── blocks/      (The actual Lauf Blocks)
│   └── marketplace/ (BlockCard, Preview, StyleVisualizer)
├── lib/
│   ├── supabase/    (client, server, middleware)
│   ├── stripe/      (client, webhook-handlers)
│   └── blocks/      (registry, loader, themes)
├── tests/e2e/       (Playwright tests)
└── supabase/migrations/
```

---

## PRICING TIERS

| Feature          | Free          | Pro ($19.99/mo) |
| ---------------- | ------------- | --------------- |
| Blocks           | 50+ Essential | 1,000+ Premium  |
| Site Generations | 1/month       | Unlimited       |
| Export           | Copy/Paste    | ZIP + CLI       |
| Support          | Community     | Priority        |

---

## STYLE VISUALIZER THEMES

1. **Minimalist**: High whitespace, thin borders, zinc/gray palette
2. **High-Brand**: Bold typography, vibrant accents (purple/blue), gradients
3. **Neo-Industrial**: Dark mode, thick borders, high contrast, yellow accents

---

## SUCCESS CRITERIA

- [ ] All 60 tasks complete
- [ ] Build passes with zero errors
- [ ] All Playwright tests green
- [ ] Lighthouse score: 100/100/100/100
- [ ] Stripe checkout works in test mode
- [ ] Block copy-to-clipboard works
- [ ] Style Visualizer toggles correctly
- [ ] AI Generator produces valid sitemaps
- [ ] Deployed to Vercel
