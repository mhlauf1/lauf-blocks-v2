# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 16 App Router project with:
- **React 19** with Server Components by default
- **Tailwind CSS 4** (using `@import "tailwindcss"` syntax and `@theme` directive)
- **TypeScript** with strict mode

### Project Structure

- `app/` - Next.js App Router pages and layouts
- `app/layout.tsx` - Root layout with Geist font configuration
- `app/globals.css` - Global styles with Tailwind and CSS custom properties for theming

### Path Alias

`@/*` maps to the project root (configured in tsconfig.json)
