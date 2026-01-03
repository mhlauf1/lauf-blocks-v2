# LaufBlocks V2 - Session Handoff Document

> **Last Updated**: January 2, 2026
> **Phase Completed**: Phase 2 (Marketplace Core)
> **Next Phase**: Phase 3 (AI Generator)

---

## Quick Context for New Session

You are building **LaufBlocks V2**, a premium React/Next.js component library and marketplace. This is similar to Relume but developer-first with copy-paste components at $19.99/mo (undercutting Relume's $40/mo).

**IMPORTANT**: You (the admin) are the sole creator of blocks. Users/members can only browse, preview, and copy blocks - they CANNOT create, edit, or upload blocks. This is the Shadcn UI / Relume model - a curated component library.

### Key Reference Files

1. **`.claude/LAUFBLOCKS_V2_CLAUDE_CODE_SPEC.md`** - Master specification
2. **`.claude/LAUFBLOCKS_QUICKSTART_PROMPT.md`** - Quick reference
3. **`PROGRESS.md`** - Live progress tracker
4. **`.claude/plans/fizzy-chasing-unicorn.md`** - Phase 2 implementation plan

---

## Current State (End of Phase 2)

### Progress: 30/60 tasks (50%)

**Phase 1 Foundation - COMPLETE ✅**
**Phase 2 Marketplace Core - COMPLETE ✅**

| Component | Status | Key Files |
|-----------|--------|-----------|
| Block Registry System | ✅ | `lib/blocks/registry.ts`, `types/block.ts` |
| Block File Loader | ✅ | `lib/blocks/loader.ts`, `lib/blocks/parser.ts` |
| BlockCard Component | ✅ | `components/marketplace/block-card.tsx` |
| BlockPreview Component | ✅ | `components/marketplace/block-preview.tsx` |
| CodeViewer (Shiki) | ✅ | `components/marketplace/code-viewer.tsx` |
| CopyButton | ✅ | `components/marketplace/copy-button.tsx` |
| StyleVisualizer (3 themes) | ✅ | `components/marketplace/style-visualizer.tsx` |
| Blocks Listing Page | ✅ | `app/(dashboard)/blocks/page.tsx` |
| Block Detail Page | ✅ | `app/(dashboard)/blocks/[slug]/page.tsx` |
| 25 Block Components | ✅ | `components/blocks/` (5 categories × 5 blocks) |
| Block Analytics | ✅ | `lib/blocks/analytics.ts`, `/api/blocks/[slug]/analytics` |

---

## Blocks Created (25 Total)

### Heroes (`components/blocks/heroes/`)
| Block | Tier | Description |
|-------|------|-------------|
| hero-gradient | Free | Gradient background with animated orbs |
| hero-centered | Free | Simple centered layout with badge |
| hero-split | Free | Image + content split with feature bullets |
| hero-video | Pro | Video background with play/mute controls |
| hero-animated | Pro | Framer Motion animations with floating particles |

### Navbars (`components/blocks/navbars/`)
| Block | Tier | Description |
|-------|------|-------------|
| navbar-simple | Free | Logo + links + CTA with mobile menu |
| navbar-dropdowns | Free | Dropdown menus for nested links |
| navbar-transparent | Free | Scroll-triggered backdrop reveal |
| navbar-megamenu | Pro | Full-width mega menu with sections |
| navbar-search | Pro | Integrated search with Cmd+K shortcut |

### Footers (`components/blocks/footers/`)
| Block | Tier | Description |
|-------|------|-------------|
| footer-simple | Free | Logo + copyright + quick links |
| footer-columns | Free | Multi-column organized links |
| footer-newsletter | Free | Email signup form integrated |
| footer-megalinks | Pro | Extensive link grid with badges |
| footer-social | Pro | Social-first with prominent icons |

### Features (`components/blocks/features/`)
| Block | Tier | Description |
|-------|------|-------------|
| features-grid | Free | Icon grid layout (2/3/4 columns) |
| features-alternating | Free | Left/right alternating with images |
| features-bento | Free | Bento box layout with varying sizes |
| features-icons | Pro | Large icons with multiple layouts |
| features-animated | Pro | Scroll-triggered stagger animations |

### CTAs (`components/blocks/cta/`)
| Block | Tier | Description |
|-------|------|-------------|
| cta-simple | Free | Headline + buttons centered |
| cta-image | Free | Side image with content |
| cta-banner | Free | Full-width with color variants |
| cta-floating | Pro | Fixed bottom bar with dismiss |
| cta-gradient | Pro | Animated gradient background |

---

## Phase 3 Tasks (Next Up)

The next phase builds the AI-powered site generator.

### Tasks 31-45 Overview:

| Task | Description | Priority |
|------|-------------|----------|
| 031 | Sitemap data structure + types | High |
| 032 | AI prompt templates | High |
| 033 | OpenAI/Anthropic API integration | High |
| 034 | Sitemap generator service | High |
| 035 | Block selection algorithm | High |
| 036 | Generator UI - prompt input | High |
| 037 | Generator UI - sitemap preview | High |
| 038 | Generator UI - block customization | Medium |
| 039 | Generator UI - export flow | High |
| 040 | ZIP export functionality | High |
| 041 | Code generation (combine blocks) | High |
| 042 | Tailwind config generation | Medium |
| 043 | Generation usage limits | Medium |
| 044 | Generation history | Low |
| 045 | Save/load generations | Low |

---

## File Structure After Phase 2

```
components/
├── blocks/
│   ├── heroes/          (5 blocks)
│   ├── navbars/         (5 blocks)
│   ├── footers/         (5 blocks)
│   ├── features/        (5 blocks)
│   └── cta/             (5 blocks)
├── marketplace/
│   ├── block-card.tsx
│   ├── block-preview.tsx
│   ├── code-viewer.tsx
│   ├── copy-button.tsx
│   ├── style-visualizer.tsx
│   ├── style-provider.tsx
│   └── index.ts
└── ...existing

lib/
├── blocks/
│   ├── registry.ts       (block definitions)
│   ├── loader.ts         (file loader)
│   ├── parser.ts         (TypeScript parser)
│   ├── themes.ts         (3 DNA themes)
│   ├── categories.ts     (category metadata)
│   ├── analytics.ts      (server-side tracking)
│   ├── analytics-client.ts (client-side tracking)
│   └── index.ts
└── ...existing

app/(dashboard)/
├── blocks/
│   ├── page.tsx              (listing)
│   ├── blocks-filters.tsx    (category/tier/search)
│   ├── blocks-grid.tsx       (card grid)
│   └── [slug]/
│       ├── page.tsx          (detail - server)
│       └── block-detail-view.tsx (detail - client)
└── ...existing

app/api/blocks/[slug]/
└── analytics/
    └── route.ts              (POST/GET analytics)

types/
└── block.ts                  (BlockMeta, PropDefinition, etc.)
```

---

## Key Technical Decisions Made

1. **Block Source = Filesystem**: Blocks live in `components/blocks/`, NOT database
2. **Database for Metadata Only**: `blocks` table stores analytics, not source code
3. **3 DNA Themes**: Minimalist, High-Brand, Neo-Industrial (CSS variables)
4. **Shiki for Syntax Highlighting**: Server-side rendering for performance
5. **Analytics via API**: Client sends to `/api/blocks/[slug]/analytics`
6. **Type Assertions for Supabase**: Used `as any` for some queries due to strict typing

---

## Commands

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build (must pass after each task)
npm run lint       # ESLint
npm run test:e2e   # Playwright tests
```

---

## Known Issues / Notes

1. **Middleware Warning**: Next.js 16 shows deprecation warning (can ignore)
2. **Supabase Type Inference**: Some queries need `as any` due to complex type inference
3. **Block Preview**: Currently shows placeholder - needs dynamic component loading
4. **Preview Images**: Need to generate `/blocks/{category}/{slug}.png` images

---

## Dependencies Added This Phase

```bash
npm install shiki  # Syntax highlighting
```

Note: `framer-motion` was already installed in Phase 1.

---

## Starting the Next Session

1. Read this file for context
2. Check `PROGRESS.md` for current status
3. Reference `.claude/LAUFBLOCKS_V2_CLAUDE_CODE_SPEC.md` for detailed specs
4. Start with TASK-031 (Sitemap Data Structure)
5. Run `npm run build` after each task to verify

**Goal**: Complete Phase 3 (Tasks 31-45) to have a working AI site generator.
