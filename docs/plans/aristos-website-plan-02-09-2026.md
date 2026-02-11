# Aristos Greek Restaurant Website — Implementation Plan

## Context

Building a website for **Aristos**, a casual/fast-food Greek restaurant. The site will serve as a reusable template for future restaurant clients — each new client gets a forked repo with a different theme config and their own Sanity CMS project. The client manages their own content (menu, hours, jobs, etc.) via Sanity Studio.

**Approach:** Build specifically for Aristos. The theme system and page toggles already provide good template scaffolding. Don't over-engineer for hypothetical future clients. When client #2 arrives, real requirements will guide what to abstract.

**Stack:** Next.js 16 (App Router) + Sanity v5 CMS + Tailwind CSS 4 + TypeScript
**Deployment:** Vercel (frontend) + Sanity hosted (CMS)
**Email:** Resend (catering inquiry form)
**Analytics:** Vercel Analytics (zero-config, privacy-friendly, no cookie banner)

---

## Site Structure

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Hero, featured menu, location/hours, order CTAs |
| Menu | `/menu` | Full categorized menu with dietary tags |
| Catering | `/catering` | Packages + inquiry form (toggleable) |
| Locations | `/locations` | All locations with maps, hours, click-to-call |
| Careers | `/careers` | Job listings from CMS (toggleable) |
| Allergens | `/allergens` | Allergen info per menu item (toggleable) |
| Privacy | `/privacy` | Rich text legal page |
| Terms | `/terms` | Rich text legal page |
| Sanity Studio | `/studio` | Embedded CMS for client self-service |

---

## Phase 1: Project Scaffold

1. `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*"` (pulls Next.js 15)
2. Install dependencies:
   - `next-sanity @sanity/image-url @sanity/vision sanity @portabletext/react`
   - `resend @react-email/components`
   - `clsx tailwind-merge schema-dts`
   - `@vercel/analytics`
3. Create `.env.local` / `.env.example` with Sanity, Resend, and site URL vars
4. Configure `next.config.mjs` (Sanity image domain)
5. Create full directory structure (route groups `(site)` and `(studio)`)
6. Initialize Sanity project: `npx sanity@latest init --env`

## Phase 2: Sanity CMS Schemas

Build content model before any frontend work — schemas define the data contracts.

**Object schemas** (reusable building blocks):
- `dayHours` — day, openTime, closeTime, isClosed
- `socialLink` — platform, url
- `deliveryApp` — name, url, logo

**Document schemas:**
- `siteSettings` (singleton) — name, tagline, logo, phone, email, social links, delivery apps, hero image, CTAs, page toggles (enableCatering/Careers/Allergens), SEO defaults. **Also includes:**
  - **CMS-driven UI text:** hero headline, hero subheadline, primary CTA text + link, secondary CTA text + link, section headings for homepage blocks (e.g., "Our Menu", "Find Us"), key button labels (order button text, view menu text)
  - **Announcement bar fields:** `announcementEnabled` (boolean), `announcementText` (string), `announcementLink` (optional url), `announcementStyle` (enum: info/warning/celebration)
- `menuCategory` — name, slug, sortOrder, description
- `menuItem` — name, slug, description, price, photo, category ref, dietaryTags (V/VG/GF), allergens array, isFeatured, isAvailable
- `location` — name, address, phone, googleMapsEmbed, googleMapsLink, hours[], isPrimary, sortOrder
- `cateringPackage` — name, description, priceRange, image, sortOrder
- `jobListing` — title, description (rich text), location, type, applyUrl/applyEmail, isActive, postedDate
- `pageContent` — title, slug, body (Portable Text) — for Privacy, Terms, Allergens intro

**Studio config:**
- Singleton pattern for siteSettings (direct edit link, restricted document actions)
- Custom structure grouping: Site Settings > Menu (Categories + Items) > Locations > Catering > Jobs > Pages
- Schema registry in `src/sanity/schemas/index.ts`

**Sanity client & helpers:**
- `src/sanity/env.ts` — env var exports
- `src/sanity/lib/client.ts` — createClient
- `src/sanity/lib/fetch.ts` — `sanityFetch` with tag-based revalidation
- `src/sanity/lib/image.ts` — `urlFor` helper
- `src/sanity/lib/queries.ts` — all GROQ queries

## Phase 3: Theme & Configuration System ✅

The core of the template strategy. A single config file drives all visual customization.

- **`src/lib/theme.ts`** — exports colors (primary, secondary, accent, background, foreground, muted, border, destructive), fonts (DM Serif Display headings, Inter body), border radii for Aristos
- **`src/app/globals.css`** — CSS custom properties wired into Tailwind CSS 4's `@theme inline` directive (no space-separated RGB needed — Tailwind 4 handles opacity modifiers natively with any color format)
- **No `tailwind.config.ts`** — Tailwind CSS 4 uses `@theme` in CSS instead of a JS config file
- **`src/lib/utils.ts`** — `cn()` (clsx + tailwind-merge), `formatPrice()`, `formatPhoneHref()`
- **`src/app/layout.tsx`** — updated with DM Serif Display + Inter from Google Fonts, `title.template` for SEO, `<Analytics />` from `@vercel/analytics`

**To re-theme for a new client:** change `theme.ts` + CSS custom property values in `globals.css`. No component changes needed.

## Phase 4: Design Guide

Formalize all visual and UX decisions into a reference document before building components. This ensures every component is built to spec rather than improvised, and gives future clients a design guide to customize alongside the theme config.

**Output:** `docs/reference/DESIGN-GUIDE.md`

**Process:** Brainstorm session to define each section, then document.

**Sections:**
- **Design philosophy** — Aristos brand personality, visual tone (Mediterranean, warm, appetizing, trustworthy)
- **Color palette with usage rules** — when to use primary vs secondary vs accent, semantic color assignments (CTAs, hover states, section backgrounds, text hierarchy)
- **Typography scale** — heading levels (h1–h6 sizes, weights, line heights), body, caption, button text, menu prices
- **Spacing system** — consistent padding/gap rhythm (8-point or 4-point base scale), section padding, card padding, component spacing
- **Border radius** — usage rules per component type
- **Shadow system** — elevation levels for cards, nav, dropdowns on light backgrounds
- **Layout system** — container max-widths, grid columns, responsive breakpoints (375px, 768px, 1024px, 1440px)
- **Responsive behavior** — how each component type adapts (nav collapse, card grid → stack, hero text sizing, image cropping)
- **Image treatment** — hero aspect ratios, overlay opacity/gradient, menu item photo sizing, placeholder/fallback behavior
- **Component specifications** — buttons (primary/secondary/outline/ghost with all states: default, hover, focus, active, disabled), cards, nav, footer, form inputs, announcement bar, dietary tags
- **Hover/focus/active states** — web interaction states, focus rings for keyboard navigation, link styling
- **Animation & transitions** — hover transitions, mobile menu slide, scroll behavior, page transitions
- **Section patterns** — homepage block flow, alternating section backgrounds, consistent section padding
- **Navigation patterns** — sticky nav behavior, mobile hamburger menu, scroll-triggered style changes
- **Iconography** — icon set (Lucide), style (outlined), sizes, usage guidelines
- **Messaging & copy tone** — restaurant voice, CTA language style, empty state messaging
- **Accessibility notes** — contrast ratios, touch/click target sizes, motion preferences, screen reader considerations
- **Implementation tokens** — final CSS custom properties reference (single place to cross-check theme.ts and globals.css)

## Phase 5: Reusable UI Components

All server components unless noted. Uses theme via Tailwind classes. **Built to Design Guide spec (Phase 4).**

**Shared:** Container, Button (primary/secondary/outline), SectionHeading, SanityImage, PortableTextRenderer, GoogleMap

**Layout:**
- AnnouncementBar — dismissable banner above Navbar. Server component with client wrapper for dismiss button. Dismissal stored in sessionStorage (reappears on next visit). Styled per `announcementStyle` using theme colors.
- Navbar (sticky) + MobileMenu (`'use client'`) — **primary nav links only:** Home, Menu, Catering (if enabled), Locations. These are the links in both the desktop navbar and the mobile hamburger menu.
- Footer (multi-column) — includes **secondary links:** Careers (if enabled), Allergens (if enabled), Privacy, Terms. These pages are *not* in the navbar/hamburger menu.
- OrderStrip (delivery apps + call button)

**Home:** Hero (full-width image + overlay + CTAs — reads headline, subheadline, CTA text from siteSettings), MenuHighlights (4 featured items grid — section heading from siteSettings), LocationPreview (primary location + map — section heading from siteSettings)

**Menu:** CategoryTabs (`'use client'`, horizontal scroll), MenuItemCard, DietaryIcon (V/VG/GF pills)

**Catering:** CateringHero, PackageCard, InquiryForm (`'use client'`, uses server action, includes honeypot field — hidden input that bots fill, humans don't)

**Locations:** LocationCard (address, phone, hours, map)

**Careers:** JobCard (title, type badge, apply button)

**SEO:** JsonLd (Restaurant schema.org structured data)

## Phase 6: Page Assembly

> **Pre-work: Quick brainstorm session before starting.**
> Decisions to make before assembling pages:
> - **Homepage section order & flow** — What sequence after the hero? (e.g., Hero → Featured Items → Order Strip → Location Preview? Or Hero → Order Strip → Featured Items → Location Preview?) What story does the scroll tell a hungry lunch customer?
> - **Homepage copy** — Hero headline/subheadline wording, section heading text ("Our Menu"? "What's Good"? "Fresh from the Grill"?), CTA labels
> - **Catering page structure** — Hero with what message? Packages first or inquiry form first? Any intro text?
> - **404 page personality** — Branded how? Playful ("Lost your appetite?") or straightforward ("Page not found")?
> - **Catering form fields** — What info to collect? (Name, email, phone, event date, guest count, package preference, message?) Which fields required?

Each page is a server component fetching data via `sanityFetch`.

- **Root layout** (`src/app/layout.tsx`) — html, body, font, globals.css, `<Analytics />` from `@vercel/analytics`
- **Site layout** (`src/app/(site)/layout.tsx`) — wraps all public pages with AnnouncementBar + Navbar + Footer + JsonLd
- **Studio route** (`src/app/(studio)/studio/[[...tool]]/`) — NextStudio client component, no site chrome
- **Home** — Hero + MenuHighlights + LocationPreview + OrderStrip
- **Menu** — CategoryTabs + MenuItemCards grouped by category
- **Catering** — check `enableCatering`, CateringHero + PackageCards + InquiryForm
- **Locations** — LocationCards for all locations
- **Careers** — check `enableCareers`, JobCards or "no openings" message
- **Allergens** — check `enableAllergens`, intro text + menu items with allergen tags
- **Privacy/Terms** — PortableTextRenderer with prose styling
- **404** — branded not-found page

## Phase 7: Forms, API Routes, SEO & Polish

- **Server action** (`src/actions/sendCateringInquiry.ts`) — validates form, sends email via Resend. **Also includes:** honeypot validation (reject if hidden field is filled) + server-side rate limiting (3 submissions per IP per hour using in-memory Map with TTL cleanup, or Vercel KV if available)
- **Email template** (`src/emails/CateringInquiry.tsx`) — React Email template
- **Revalidation webhook** (`src/app/api/revalidate/route.ts`) — Sanity webhook triggers `revalidateTag`
- **SEO** — `generateMetadata` per page, `title.template` in root layout, OG images from Sanity
- **Sitemap** (`src/app/sitemap.ts`) — dynamic, respects page toggle settings
- **Conditional navigation** — Careers, Allergens, and Catering links are hidden (from footer or navbar respectively) and their routes return `notFound()` when disabled via page toggles in siteSettings

## Phase 8: Content Seeding

> **Pre-work: Content gathering session before seeding.**
> This phase depends on real Aristos content — most can't be invented. Decisions and inputs needed:
> - **Menu items & prices** — Pull from existing site, or does the client have an updated menu? Confirm categories (current site shows: Chicken Souvlaki, Pork Souvlaki, Gyros, Calamari, Greek Salad, Shrimp, Steak, Falafel). Are Wraps/Bowls/Salads the right category split, or should it match how the physical menu is organized?
> - **Photography** — Does the client have high-res food photos? Can we use images from the existing site? Do we need to arrange a photo shoot? Placeholder images for launch?
> - **Catering packages** — What does Aristos actually offer for catering? Pricing? Package names?
> - **Dietary & allergen info** — Does the client have this data, or do we need to request it?
> - **Hero image** — Which dish or shot best represents Aristos? The Greek salad from the current site?
> - **Logo files** — Need high-res version of the logo, plus a white/inverted version for the dark footer
> - **Legal pages** — Does Aristos have existing Privacy Policy / Terms? Or do we draft standard ones?

Populate Sanity Studio with Aristos content:
- Site settings (name, tagline, logo, hero, CTAs, delivery apps, phone, **hero headline/subheadline, section headings, button labels, announcement bar config**)
- Menu categories and items with photos, prices, dietary tags, allergens (4 marked featured)
- 1 primary location with full hours
- Catering packages
- Privacy Policy, Terms, Allergens intro page content
- 1-2 sample job listings

## Phase 9: Deployment

1. Push to GitHub
2. Import in Vercel, set env vars (Vercel Analytics auto-enabled on deploy)
3. Sanity dashboard: add Vercel URL to CORS origins, create revalidation webhook
4. Resend: verify sending domain
5. Optional: configure custom domain

---

## Key Files

| File | Purpose |
|------|---------|
| `docs/reference/DESIGN-GUIDE.md` | Design reference — all visual/UX decisions for Aristos (and template baseline for future clients) |
| `src/lib/theme.ts` | Template customization hub — colors, fonts, radii |
| `src/app/globals.css` | CSS custom properties driving Tailwind 4 `@theme` tokens |
| `src/lib/utils.ts` | Utility functions — `cn()`, `formatPrice()`, `formatPhoneHref()` |
| `src/sanity/schemas/documents/siteSettings.ts` | Global config singleton — most complex schema (includes UI text + announcement fields) |
| `src/sanity/lib/fetch.ts` | Data fetching with tag-based caching |
| `src/sanity/lib/queries.ts` | All GROQ queries in one place |
| `src/components/AnnouncementBar.tsx` | Dismissable announcement banner above Navbar |
| `src/app/layout.tsx` | Root layout — includes `<Analytics />` from @vercel/analytics, DM Serif Display + DM Sans fonts |
| `src/app/(site)/layout.tsx` | Site chrome (AnnouncementBar + nav + footer + JSON-LD) |
| `sanity.config.ts` | Sanity Studio config with singleton pattern |
| `src/actions/sendCateringInquiry.ts` | Catering form server action (with honeypot + rate limiting) |
| `src/app/api/revalidate/route.ts` | Webhook-triggered cache revalidation |

## Dependency Graph

```
Phase 1 (Scaffold — Next.js 16 + Vercel Analytics dep)
  ├── Phase 2 (Sanity Schemas + announcement + UI text fields)
  └── Phase 3 (Theme/Config — Tailwind 4) ──┤  (parallel)
                                              └── Phase 4 (Design Guide — brainstorm + document)
                                                   └── Phase 5 (Components — built to Design Guide spec)
                                                        └── Phase 6 (Pages + Analytics + AnnouncementBar in layout)
                                                             └── Phase 7 (SEO/Forms/Polish + rate limiting)
                                                                  └── Phase 8 (Content Seed — Aristos-specific)
                                                                       └── Phase 9 (Deploy + Vercel Analytics auto-enabled)
```

## Verification

1. `npm run dev` — all pages render without errors
2. `/studio` — Sanity Studio loads, can create/edit all content types
3. Create a menu item in Studio → verify it appears on `/menu` and home page (if featured)
4. Toggle `enableCatering` off → verify `/catering` returns 404 and nav link disappears
5. Submit catering inquiry form → verify email received via Resend
6. Run Lighthouse audit → target 90+ on all categories
7. Test mobile responsiveness at 375px, 768px, 1024px, 1440px breakpoints
8. Validate JSON-LD at `/` with Google Rich Results Test
9. Verify `/sitemap.xml` includes all active pages
10. Announcement bar: toggle `announcementEnabled` on in Studio → verify banner appears above navbar on all pages. Dismiss it → verify it stays dismissed during the session.
11. Spam protection: submit catering form with honeypot field filled → verify rejection. Submit 4+ times rapidly → verify rate limiting kicks in.
12. Analytics: deploy to Vercel → verify analytics data appears in Vercel dashboard within 24 hours.
13. UI text: change hero headline in Studio → verify it updates on the homepage after revalidation.

## Items Considered and Deferred

| Item | Reason for Deferral |
|------|---------------------|
| Online ordering integration | Aristos uses third-party delivery apps. Native ordering is a major feature — add when there's demand. |
| Daily specials section | Can be added later as a new schema + homepage block. Not critical for launch. |
| Google Reviews widget | Requires Google Places API integration. Add in a future iteration. |
| Photo gallery | Menu item photos + hero image cover v1. Dedicated gallery can come later. |
| Error monitoring (Sentry) | Add when the site is in production and stability matters. Overkill for initial launch. |
| Full template documentation | Write this when client #2 actually arrives and you know what needs documenting. |
