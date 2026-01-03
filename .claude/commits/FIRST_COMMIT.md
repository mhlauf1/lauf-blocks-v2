# LaufBlocks V2 - Session Handoff Document

> **Last Updated**: January 2, 2026
> **Phase Completed**: Phase 1 (Foundation)
> **Next Phase**: Phase 2 (Marketplace Core)

---

## Quick Context for New Session

You are building **LaufBlocks V2**, a premium React/Next.js component library and marketplace. This is similar to Relume but developer-first with copy-paste components at $19.99/mo (undercutting Relume's $40/mo).

### Key Reference Files

1. **`.claude/LAUFBLOCKS_V2_CLAUDE_CODE_SPEC.md`** - Master specification with:
   - Complete tech stack details
   - Database schema (Supabase PostgreSQL)
   - Project architecture
   - Block component standards
   - Style Visualizer system (3 themes)
   - Stripe integration details
   - AI Generator specs
   - All 60 tasks broken into 5 phases

2. **`.claude/LAUFBLOCKS_QUICKSTART_PROMPT.md`** - Quick reference for:
   - File structure overview
   - Pricing tiers (Free vs Pro)
   - Style themes (Minimalist, High-Brand, Neo-Industrial)
   - Success criteria checklist

3. **`PROGRESS.md`** - Live progress tracker with:
   - Current sprint status
   - All 60 tasks with checkboxes
   - Completion summary table
   - Decisions log

---

## Current State (End of Phase 1)

### Progress: 15/60 tasks (25%)

**Phase 1 Foundation - COMPLETE ✅**

All infrastructure is in place:

| Component | Status | Key Files |
|-----------|--------|-----------|
| Next.js 16 + React 19 + Tailwind 4 | ✅ | `app/`, `tailwind.config.ts` |
| Supabase Auth | ✅ | `lib/supabase/`, `app/(auth)/` |
| Supabase Database | ✅ | `supabase/migrations/` |
| Base UI Components | ✅ | `components/ui/` (20+ Shadcn-style components) |
| App Layouts | ✅ | `app/(auth)/`, `app/(dashboard)/`, `app/(marketing)/` |
| Stripe Checkout | ✅ | `lib/stripe/`, `/api/checkout`, `/api/customer-portal` |
| Stripe Webhooks | ✅ | `/api/webhooks/stripe/` |
| Subscription System | ✅ | `hooks/use-subscription.ts`, `components/subscription/` |
| Playwright Testing | ✅ | `playwright.config.ts`, `tests/e2e/` |

### Environment Variables Configured

```
NEXT_PUBLIC_SUPABASE_URL=✅
NEXT_PUBLIC_SUPABASE_ANON_KEY=✅
SUPABASE_SERVICE_ROLE_KEY=✅
STRIPE_SECRET_KEY=✅
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=✅
STRIPE_WEBHOOK_SECRET=✅
```

**Missing** (needed for Stripe checkout):
- `STRIPE_PRO_PRICE_ID` - Create a product/price in Stripe dashboard

---

## Phase 2 Tasks (Next Up)

The next phase builds the marketplace core - the block browsing, preview, and copy functionality.

### Tasks 16-30 Overview:

| Task | Description | Priority |
|------|-------------|----------|
| 016 | Block registry system (`lib/blocks/registry.ts`) | High |
| 017 | Block file loader (read source code, parse interfaces) | High |
| 018 | BlockCard component (preview image, badges, stats) | High |
| 019 | BlockPreview component (live render in iframe) | High |
| 020 | CodeViewer component (syntax highlighting with Shiki) | High |
| 021 | CopyButton component (copy code, copy CLI) | High |
| 022 | StyleVisualizer (3 theme toggle) | Medium |
| 023 | Blocks listing page (`/dashboard/blocks`) | High |
| 024 | Block detail page (`/dashboard/blocks/[slug]`) | High |
| 025 | First 5 Hero blocks | Medium |
| 026 | First 5 Navbar blocks | Medium |
| 027 | First 5 Footer blocks | Medium |
| 028 | First 5 Features blocks | Medium |
| 029 | First 5 CTA blocks | Medium |
| 030 | Block analytics tracking | Low |

### Recommended Execution Order:

1. **Start with registry + loader** (016-017) - Core infrastructure
2. **Build UI components** (018-021) - BlockCard, Preview, CodeViewer, CopyButton
3. **Create pages** (023-024) - Listing and detail pages
4. **Add StyleVisualizer** (022) - Theme switching
5. **Build actual blocks** (025-029) - 25 blocks total
6. **Add analytics** (030) - Track views/copies

---

## Tech Stack Reference

```yaml
Framework: Next.js 16.1.1 (App Router)
Language: TypeScript 5.x (Strict Mode)
Styling: Tailwind CSS 4.0
UI Primitives: Radix UI
Animations: Framer Motion
Icons: Lucide React
Database: Supabase (PostgreSQL + Auth)
Payments: Stripe
Testing: Playwright
Deployment: Vercel (planned)
```

---

## Key Architectural Decisions

1. **Shadcn UI Philosophy**: Components are copy-pasted, not installed as packages
2. **Server Components by Default**: Use `"use client"` only when needed
3. **Type Safety**: Strict TypeScript with `noUncheckedIndexedAccess: true`
4. **3 Style Themes**: Each block has Minimalist, High-Brand, Neo-Industrial variants
5. **Block Tiers**: Free blocks available to all, Pro blocks require subscription

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

1. **Middleware Warning**: Next.js 16 shows deprecation warning for middleware (can ignore for now)
2. **Supabase Types**: Some queries need `as any` type assertions due to strict typing
3. **Stripe API Version**: Using `2025-12-15.clover`

---

## Files Created This Session

### Authentication (`app/(auth)/`)
- `login/page.tsx` - Login with email/password + OAuth (Google, GitHub)
- `signup/page.tsx` - Signup with email verification flow
- `forgot-password/page.tsx` - Password reset request
- `update-password/page.tsx` - Set new password after reset
- `callback/route.ts` - OAuth callback handler

### Supabase (`lib/supabase/`)
- `actions.ts` - Server actions for auth (signIn, signUp, signOut, passwordReset)
- `get-user.ts` - Utilities to fetch current user with profile/subscription

### Auth Components (`components/auth/`)
- `require-auth.tsx` - Server components: RequireAuth, AuthGuard, WithUser
- `auth-provider.tsx` - Client-side AuthProvider + useAuth hook
- `index.ts` - Barrel export

### Stripe (`lib/stripe/`)
- `client.ts` - Stripe server client
- `config.ts` - Plan definitions (Free, Pro at $19.99/mo)
- `webhook-handlers.ts` - Handle checkout, subscription updates, cancellation

### Stripe API Routes (`app/api/`)
- `checkout/route.ts` - Create Stripe checkout session
- `customer-portal/route.ts` - Redirect to Stripe customer portal
- `webhooks/stripe/route.ts` - Webhook endpoint with signature verification

### Subscription (`lib/subscription/`, `hooks/`, `components/subscription/`)
- `check-access.ts` - Access control utilities
- `use-subscription.ts` - Hook for subscription state
- `subscription-provider.tsx` - Context provider
- `subscription-badge.tsx` - SubscriptionBadge + BlockTierBadge components

### Testing (`tests/e2e/`)
- `smoke.spec.ts` - 8 smoke tests for auth pages and routing
- `playwright.config.ts` - Playwright configuration

---

## Starting the Next Session

1. Read this file for context
2. Check `PROGRESS.md` for current status
3. Reference `.claude/LAUFBLOCKS_V2_CLAUDE_CODE_SPEC.md` for detailed specs
4. Start with TASK-016 (Block Registry System)
5. Run `npm run build` after each task to verify

**Goal**: Complete Phase 2 (Tasks 16-30) to have a working block marketplace.
