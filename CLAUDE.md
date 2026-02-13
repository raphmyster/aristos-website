# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (port 3000)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Type check:** `npx tsc --noEmit`

No test framework is configured.

## Architecture

Next.js 16 App Router + Sanity v5 CMS + Tailwind CSS 4 + TypeScript. React 19 with server components by default.

### Route Groups

- `src/app/(site)/` — public pages. The layout fetches `siteSettings` and `primaryLocation` from Sanity, renders AnnouncementBar + Navbar + Footer around `{children}`.
- `src/app/(studio)/studio/[[...tool]]/` — embedded Sanity Studio. No site chrome.

### Data Flow

Server components fetch from Sanity using `sanityFetch()` (in `src/sanity/lib/fetch.ts`) with tag-based ISR revalidation. Data flows down as props to client components. Client components (`"use client"`) handle interactivity only — never fetch data.

All GROQ queries live in `src/sanity/lib/queries.ts`. Sanity image URLs are built with `urlFor()` from `src/sanity/lib/image.ts`.

### Component Organization

Components are grouped by page domain: `shared/`, `layout/`, `home/`, `menu/`, `catering/`, `locations/`, `careers/`, `seo/`. Default exports for all components.

**Server/client split pattern:** When a component needs partial interactivity, the server component acts as a thin wrapper passing props to a `*Client.tsx` counterpart (e.g., `Hero.tsx` → `HeroClient.tsx`, `AnnouncementBar.tsx` → `AnnouncementBarClient.tsx`). Exception: `Navbar.tsx` is fully client-side due to scroll detection + mobile menu.

### Theme System

Single source of truth: `src/lib/theme.ts` (TypeScript constants) + `src/app/globals.css` (CSS custom properties fed into Tailwind 4's `@theme inline`). To re-theme for a new client, change both files. No `tailwind.config.ts` — Tailwind CSS 4 uses `@theme` in CSS.

Key tokens: `--color-primary` (Greek blue #1E3A8A), `--color-background` (warm white #FAF9F6), `--font-heading` (DM Serif Display), `--font-body` (DM Sans).

### Sanity CMS Schemas

Singleton: `siteSettings` (global config with 7 field groups). Documents: `menuCategory`, `menuItem`, `location`, `cateringPackage`, `jobListing`, `pageContent`. Objects: `dayHours`, `socialLink`, `deliveryApp`. Schema registry: `src/sanity/schemas/index.ts`.

## Key Conventions

- **Imports:** `@/` alias maps to `src/`. Use `import { cn } from "@/lib/utils"` for Tailwind class merging (clsx + tailwind-merge).
- **Tailwind CSS 4:** Use theme token classes (`bg-primary`, `text-foreground`, `font-heading`, `rounded-lg`) — not hardcoded hex values. Responsive prefixes: `md:` (768px), `lg:` (1024px).
- **Button component** is polymorphic: renders `<a>` when `href` prop is provided, `<button>` otherwise. Four variants: `primary`, `secondary`, `outline`, `ghost`. Three sizes: `sm`, `default`, `lg`.
- **Accessibility:** All interactive elements need focus rings, 44px minimum touch targets, `prefers-reduced-motion` support via Tailwind's `motion-safe:` prefix. Design Guide requires WCAG AA contrast.
- **Icons:** Lucide React, outlined style, 2px stroke, 20px default / 24px standalone.

## Reference Documents

- `docs/reference/DESIGN-GUIDE.md` — all visual specs (colors, typography, spacing, component states, animations). Consult before building any UI.
- `docs/plans/aristos-website-plan-02-09-2026.md` — full implementation plan (9 phases).

## Environment Variables

See `.env.example`. Requires: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL`.
