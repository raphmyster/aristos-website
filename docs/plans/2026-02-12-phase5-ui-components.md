# Phase 5: Reusable UI Components — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build all reusable UI components for the Aristos website, following the Design Guide spec exactly.

**Architecture:** Server components by default, `'use client'` only where interactivity is needed (MobileMenu, CategoryTabs, InquiryForm, AnnouncementBar dismiss). All components consume the Tailwind theme tokens defined in globals.css via utility classes. Data is passed as props — no data fetching inside components (that happens in Phase 6 pages).

**Tech Stack:** Next.js 16 (React 19), Tailwind CSS 4, Lucide React (icons), next-sanity, @portabletext/react

**Key References:**
- Design Guide: `docs/reference/DESIGN-GUIDE.md`
- Theme: `src/lib/theme.ts` + `src/app/globals.css`
- Utilities: `src/lib/utils.ts` — `cn()`, `formatPrice()`, `formatPhoneHref()`
- Sanity helpers: `src/sanity/lib/image.ts` — `urlFor()`, `src/sanity/lib/fetch.ts` — `sanityFetch()`
- GROQ queries: `src/sanity/lib/queries.ts`

---

### Task 1: Install lucide-react

Lucide React is the icon library specified in the design guide but not yet installed.

**Step 1: Install**

Run: `npm install lucide-react`

**Step 2: Verify**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add lucide-react icon library"
```

---

### Task 2: Shared Components — Container, Button, SectionHeading

**Files:**
- Create: `src/components/shared/Container.tsx`
- Create: `src/components/shared/Button.tsx`
- Create: `src/components/shared/SectionHeading.tsx`

#### Container

A max-width wrapper that centers content with responsive padding. Refer to Design Guide > Layout System > Container Widths.

```tsx
// Server component (no directive needed)
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType; // defaults to "div"
}
```

Specs:
- `max-w-[1200px]` (wide breakpoint container)
- Horizontal padding: `px-4` (16px mobile), `md:px-6` (24px tablet), `lg:px-8` (32px desktop)
- `mx-auto` to center
- Renders as `as` element type (div by default, useful for `section`)

#### Button

All 4 variants (primary, secondary, outline, ghost) × 3 sizes (sm, default, lg). Refer to Design Guide > Buttons.

```tsx
// Server component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  asChild?: boolean; // when true, renders as Slot-like pattern for wrapping <Link>
  href?: string;     // if provided, renders as <a> tag
  children: React.ReactNode;
  className?: string;
}
```

Key specs from Design Guide:
- **Primary:** `bg-primary text-white`, no border
- **Secondary:** `bg-transparent text-primary border-[1.5px] border-primary`
- **Outline:** `bg-transparent text-foreground border-[1.5px] border-border`
- **Ghost:** `bg-transparent text-secondary`, no border
- **Sizes:** sm=`py-2 px-4 text-sm rounded-sm`, default=`py-3 px-6 text-base rounded-md`, lg=`py-4 px-8 text-base rounded-md`
- **States:** hover darken 10% + scale-[1.02] 150ms ease, focus ring 2px primary offset-2, active darken 15% + scale-[0.98], disabled opacity-50 pointer-events-none
- Font: `font-body font-medium` (500) for all sizes
- When `href` is provided, render as `<a>` tag instead of `<button>`

#### SectionHeading

```tsx
// Server component
interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4"; // defaults to "h2"
}
```

Specs:
- `font-heading` (DM Serif Display)
- Default h2: `text-2xl md:text-[32px]` (24px → 32px), `leading-[1.2] tracking-[-0.01em]`
- h1: `text-[30px] md:text-[40px]`
- Text color: `text-foreground`
- Bottom margin left to consumer (not built in)

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/shared/
git commit -m "feat: add Container, Button, and SectionHeading shared components"
```

---

### Task 3: Shared Components — SanityImage, PortableTextRenderer, GoogleMap

**Files:**
- Create: `src/components/shared/SanityImage.tsx`
- Create: `src/components/shared/PortableTextRenderer.tsx`
- Create: `src/components/shared/GoogleMap.tsx`

#### SanityImage

Wrapper around Next.js `<Image>` that integrates with Sanity's image pipeline.

```tsx
// Server component
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface SanityImageProps {
  image: any; // Sanity image object
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
}
```

- Uses `urlFor(image).url()` to generate the src URL
- Passes through all standard Next.js Image props
- Handles missing image gracefully (renders nothing or placeholder)

#### PortableTextRenderer

Wraps `@portabletext/react` with prose-styled typography for legal pages (Privacy, Terms, Allergens intro).

```tsx
// Server component
import { PortableText } from "@portabletext/react";

interface PortableTextRendererProps {
  value: any; // Portable Text array
  className?: string;
}
```

- Apply prose-like styles: headings use `font-heading`, body uses `font-body`
- Paragraphs: `text-base leading-relaxed text-foreground mb-4`
- h2: `text-2xl font-heading mt-8 mb-4`
- h3: `text-xl font-heading mt-6 mb-3`
- Links: `text-primary underline hover:text-primary/80`
- Lists: proper list markers, `ml-6 mb-4`
- Custom `components` object passed to `<PortableText>`

#### GoogleMap

Embeds a Google Maps iframe.

```tsx
// Server component
interface GoogleMapProps {
  embedUrl: string;
  title?: string;
  className?: string;
}
```

- Renders an `<iframe>` with `loading="lazy"`, `referrerpolicy="no-referrer"`
- Default aspect ratio: 16:9 on desktop, 4:3 on mobile
- Rounded corners: `rounded-lg`
- Border: `border border-border`

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/shared/
git commit -m "feat: add SanityImage, PortableTextRenderer, and GoogleMap shared components"
```

---

### Task 4: Layout — AnnouncementBar

**Files:**
- Create: `src/components/layout/AnnouncementBar.tsx` (server component wrapper)
- Create: `src/components/layout/AnnouncementBarClient.tsx` (`'use client'` for dismiss)

The announcement bar sits above the Navbar. It's controlled by CMS fields from siteSettings: `announcementEnabled`, `announcementText`, `announcementLink`, `announcementStyle`.

#### Data shape (from siteSettings query):

```ts
{
  announcementEnabled: boolean;
  announcementText: string;
  announcementLink?: string;
  announcementStyle: "info" | "warning" | "celebration";
}
```

#### AnnouncementBar (server)

```tsx
interface AnnouncementBarProps {
  enabled: boolean;
  text: string;
  link?: string;
  style: "info" | "warning" | "celebration";
}
```

- If `!enabled`, render nothing
- Wraps `AnnouncementBarClient` passing through props

#### AnnouncementBarClient (client)

- `'use client'`
- On mount, check `sessionStorage.getItem("announcement-dismissed")` — if truthy, hide
- Dismiss button (X icon from Lucide) sets `sessionStorage.setItem("announcement-dismissed", "true")` and hides bar
- Fade out + collapse height animation on dismiss (200ms ease)

Design Guide > Announcement Bar specs:

| Style | Background | Text Color |
|-------|-----------|------------|
| info | `bg-primary-light` (#DBEAFE) | `text-primary` |
| warning | `bg-[#FEF3C7]` | `text-[#92400E]` |
| celebration | `bg-primary` | `text-white` |

- Height: `h-10`, centered text, `text-sm font-medium font-body`
- If `link` provided, text is a clickable underlined link
- Dismiss: small X button right-aligned, inherits text color

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/layout/AnnouncementBar.tsx src/components/layout/AnnouncementBarClient.tsx
git commit -m "feat: add AnnouncementBar with dismiss support"
```

---

### Task 5: Layout — Navbar + MobileMenu

**Files:**
- Create: `src/components/layout/Navbar.tsx` (server component)
- Create: `src/components/layout/MobileMenu.tsx` (`'use client'`)
- Create: `src/components/layout/NavbarClient.tsx` (`'use client'` for scroll detection)

The navbar is sticky with scroll-triggered styling. Mobile menu is a full-screen overlay.

#### Data shape (passed as props from layout):

```ts
{
  logo?: any;         // Sanity image
  orderButtonText: string;  // e.g., "Order Now"
  primaryCtaLink: string;
  enableCatering: boolean;
}
```

#### NavbarClient (client wrapper)

- `'use client'`
- Tracks scroll position with `useState` + `useEffect` (scroll event listener)
- When `scrollY > 10`: adds border-bottom, nav shadow, backdrop-blur
- Wraps children and passes `isScrolled` state via data attribute or class

#### Navbar (server — rendered inside NavbarClient)

Design Guide > Navigation > Navbar:
- `sticky top-0 z-50`
- Height: `h-[72px]` desktop, `h-16` mobile
- Background: `bg-background` at top, `bg-background/95 backdrop-blur-md` on scroll
- Border bottom on scroll: `border-b border-border`
- Shadow on scroll: `shadow-[0_1px_4px_rgba(0,0,0,0.05)]`
- Logo: left-aligned, max-h-12 desktop / max-h-10 mobile
- **Primary nav links (desktop):** Home, Menu, Catering (if `enableCatering`), Locations
  - `text-[15px] font-medium font-body text-foreground`
  - Hover: underline slides in from left, 2px primary, offset 4px (use `after:` pseudo)
  - Active: `text-primary`
- CTA button: rightmost, primary button small size ("Order Now" from CMS)
- Mobile: logo left, hamburger icon right (Menu icon from Lucide, 24px)

#### MobileMenu (client)

- `'use client'`
- Full-screen overlay, `bg-background`, slides from right (250ms ease-out open, 200ms ease-in close)
- Hamburger animates to X icon on open
- Links: stacked, `text-2xl font-heading`, `min-h-12` (48px tap targets), centered
- Same links as desktop: Home, Menu, Catering (conditional), Locations
- Full-width primary CTA button at bottom
- Trap focus inside when open (for accessibility)
- Close on Escape key
- Body scroll lock when open

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/layout/Navbar.tsx src/components/layout/NavbarClient.tsx src/components/layout/MobileMenu.tsx
git commit -m "feat: add Navbar with mobile menu and scroll behavior"
```

---

### Task 6: Layout — Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`

#### Data shape (props from layout):

```ts
{
  name: string;
  tagline?: string;
  logo?: any;
  phone?: string;
  email?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  enableCatering: boolean;
  enableCareers: boolean;
  enableAllergens: boolean;
  primaryLocation?: {
    address: string;
    hours: Array<{ day: string; openTime: string; closeTime: string; isClosed: boolean }>;
  };
}
```

Design Guide > Footer:
- `bg-foreground` (#1C1917) dark background
- Text: `text-white/90`
- Secondary links: `text-white/60 hover:text-white/90`
- Padding: `py-16` (64px)
- **4 columns** desktop (grid-cols-4), **2 columns** tablet, **stacked** mobile

Columns:
1. **Brand** — Logo (or name as text if no logo), tagline, social icon row
   - Social icons: `w-5 h-5`, `text-white/60 hover:text-white`, `gap-4`
   - Use Lucide icons for social platforms: Instagram → `Instagram`, Facebook → `Facebook`, etc.
2. **Menu** — Links: Menu, Catering (if enabled), Locations
3. **Info** — Links: Careers (if enabled), Allergens (if enabled), Privacy, Terms
4. **Contact** — Address, phone (click-to-call via `formatPhoneHref()`), hours summary

Bottom bar: copyright text, `border-t border-white/10`, `pt-8 mt-8`
Copyright: `text-sm text-white/40`

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: add Footer with multi-column layout"
```

---

### Task 7: Layout — OrderStrip

**Files:**
- Create: `src/components/layout/OrderStrip.tsx`

#### Data shape:

```ts
{
  deliveryApps?: Array<{ name: string; url: string; logo?: any }>;
  phone?: string;
  orderButtonText?: string;
}
```

Design Guide > Order Strip:
- `bg-muted` (#F0EEEB)
- Horizontal row: delivery app logos + "Or call us" phone button
- Padding: `py-6` (24px)
- Delivery logos: `h-8` (32px), `grayscale hover:grayscale-0` transition (200ms)
- Phone button: secondary button style, Phone icon + number
- Use `<Container>` for content alignment
- Centered flex layout with `gap-6` between logos, divider, and phone button

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/layout/OrderStrip.tsx
git commit -m "feat: add OrderStrip delivery/call component"
```

---

### Task 8: Menu — DietaryIcon and MenuItemCard

**Files:**
- Create: `src/components/menu/DietaryIcon.tsx`
- Create: `src/components/menu/MenuItemCard.tsx`

#### DietaryIcon

Design Guide > Dietary Tag Pills:

```tsx
interface DietaryIconProps {
  tag: "V" | "VG" | "GF";
}
```

| Tag | Label | Background | Text |
|-----|-------|-----------|------|
| V | V | `bg-[#ECFDF5]` | `text-[#065F46]` |
| VG | VG | `bg-[#D1FAE5]` | `text-[#065F46]` |
| GF | GF | `bg-[#FEF3C7]` | `text-[#92400E]` |

- Shape: pill `rounded-full`, `px-2.5 py-0.5`
- Font: `text-xs font-medium uppercase`
- Gap between tags: `gap-1.5`

#### MenuItemCard

Design Guide > Menu Item Card:

```tsx
interface MenuItemCardProps {
  name: string;
  description?: string;
  price: number;
  photo?: any; // Sanity image
  dietaryTags?: string[];
  isAvailable?: boolean;
}
```

- Card: `bg-white border border-border rounded-lg` with subtle shadow
- Hover: `shadow-[0_4px_12px_rgba(0,0,0,0.1)] -translate-y-0.5` (200ms ease-out)
- Image: top of card, 3:2 aspect ratio, `object-cover`, rounded top corners (use `rounded-t-lg`)
  - Use `<SanityImage>` if photo exists, otherwise muted background placeholder
- Content padding: `p-5` (20px)
- Name: `font-heading text-xl md:text-2xl`
- Description: `text-sm text-secondary line-clamp-2` (2-line clamp)
- Price: `text-lg md:text-xl font-medium` using `formatPrice()`
- Dietary tags: row of `<DietaryIcon>` below price
- Unavailable state: image `opacity-60`, "Currently Unavailable" overlay text, card `opacity-80`

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/menu/
git commit -m "feat: add DietaryIcon and MenuItemCard components"
```

---

### Task 9: Menu — CategoryTabs

**Files:**
- Create: `src/components/menu/CategoryTabs.tsx` (`'use client'`)

Design Guide > Category Tabs:

```tsx
"use client";

interface CategoryTabsProps {
  categories: Array<{ _id: string; name: string; slug: { current: string } }>;
  activeCategory: string; // slug
  onCategoryChange: (slug: string) => void;
}
```

- `'use client'` — handles click interaction + horizontal scroll
- Layout: horizontal row, `overflow-x-auto` on mobile, `justify-center` on desktop
- Hidden scrollbar: `scrollbar-hide` (add CSS utility in globals.css: `::-webkit-scrollbar { display: none }`)
- Include an "All" tab at the start (slug: `""` or `"all"`)
- Tab shape: pill `rounded-full`, `px-5 py-2`
- Inactive: `bg-transparent border border-border text-foreground hover:bg-muted`
- Active: `bg-primary text-white`
- Font: `text-sm font-medium`
- Gap: `gap-2`
- Sticky below navbar on scroll: `sticky top-[72px] md:top-[72px] z-40 bg-background py-3 border-b border-border`
- Mobile: left-aligned, subtle right fade to hint scrollability (use gradient mask or `after:` pseudo)

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/menu/CategoryTabs.tsx
git commit -m "feat: add CategoryTabs with horizontal scroll"
```

---

### Task 10: Home — Hero

**Files:**
- Create: `src/components/home/Hero.tsx` (server component)
- Create: `src/components/home/HeroClient.tsx` (`'use client'` for entrance animation)

Design Guide > Hero Section:

#### Data shape:

```ts
{
  heroImage?: any;
  heroHeadline?: string;
  heroSubheadline?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}
```

- Full-width, full-bleed (no Container — extends edge to edge)
- Height: `min-h-[500px] h-[70vh] md:h-[85vh]`
- Image: `<SanityImage>` with `fill`, `object-cover`, `object-center`, `priority`
- Overlay: gradient via `after:` pseudo — `rgba(0,0,0,0.15)` top to `rgba(0,0,0,0.55)` bottom
- Fallback: `bg-primary` solid if no image
- Content: positioned at bottom-left on desktop (`pb-24 pl-16`), centered on mobile
- Headline: `text-4xl md:text-[56px] font-heading text-white leading-[1.2]`
  - Text shadow: `[text-shadow:0_2px_8px_rgba(0,0,0,0.3)]`
- Subheadline: `text-base font-body text-white/90 max-w-[480px]`
- CTAs: Primary (large, `<Button>`) + Secondary (large, white text/border variant)
  - Side by side on desktop (`flex gap-4`), stacked on mobile (`flex-col`)

#### HeroClient (entrance animation)

- `'use client'`
- On mount, staggered fade-up animation:
  - Hero image: fade in + scale 1.05→1.0 (0ms delay)
  - Headline: translateY 20px→0 + fade (200ms delay)
  - Subheadline: translateY 20px→0 + fade (350ms delay)
  - CTAs: translateY 20px→0 + fade (500ms delay)
- Respects `prefers-reduced-motion: reduce` — skip all animations
- Use CSS classes toggled by state, not JS animation libraries

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/home/
git commit -m "feat: add Hero section with entrance animations"
```

---

### Task 11: Home — MenuHighlights

**Files:**
- Create: `src/components/home/MenuHighlights.tsx`

```tsx
interface MenuHighlightsProps {
  heading?: string;       // from siteSettings.menuSectionHeading, e.g., "Our Menu"
  viewMenuText?: string;  // from siteSettings.viewMenuText
  items: Array<{
    _id: string;
    name: string;
    description?: string;
    price: number;
    photo?: any;
    dietaryTags?: string[];
  }>;
}
```

- Uses `<Container>`, `<SectionHeading>`, grid of `<MenuItemCard>`
- Section padding: `py-12 md:py-16` (section rhythm from design guide)
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`
- "View Menu" link at bottom: `<Button variant="secondary" href="/menu">`
- If no items, don't render the section

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/home/MenuHighlights.tsx
git commit -m "feat: add MenuHighlights homepage section"
```

---

### Task 12: Home — LocationPreview

**Files:**
- Create: `src/components/home/LocationPreview.tsx`

```tsx
interface LocationPreviewProps {
  heading?: string; // from siteSettings.locationSectionHeading
  location: {
    name: string;
    address: string;
    phone?: string;
    googleMapsEmbed?: string;
    googleMapsLink?: string;
    hours?: Array<{ day: string; openTime: string; closeTime: string; isClosed: boolean }>;
  };
}
```

- Alternating section background: `bg-muted`
- Uses `<Container>`, `<SectionHeading>`, `<GoogleMap>`
- Two-column layout on desktop: left = location info, right = map
  - `grid grid-cols-1 lg:grid-cols-2 gap-8`
- Location info: address, phone (click-to-call with Phone icon), hours list
- Hours: compact display — `text-sm`, day name left, time right, "Closed" in secondary color
- "Get Directions" link: `<Button variant="secondary" href={googleMapsLink}>`

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/home/LocationPreview.tsx
git commit -m "feat: add LocationPreview homepage section"
```

---

### Task 13: Catering — CateringHero + PackageCard

**Files:**
- Create: `src/components/catering/CateringHero.tsx`
- Create: `src/components/catering/PackageCard.tsx`

#### CateringHero

Simple hero banner for the catering page — not as tall as the homepage hero.

```tsx
interface CateringHeroProps {
  heading?: string;
  description?: string;
}
```

- `bg-muted`, `py-12 md:py-16`
- Centered text: `<SectionHeading as="h1">` + description paragraph
- Max width on text: `max-w-2xl mx-auto text-center`

#### PackageCard

```tsx
interface PackageCardProps {
  name: string;
  description?: string;
  priceRange?: string;
  image?: any;
}
```

- Same card treatment as MenuItemCard (bg-white, border, shadow, hover lift)
- Image: 16:9 aspect ratio (wider — shows platters), `<SanityImage>` or placeholder
- Content: name (h3 heading), description (`text-sm text-secondary`), price range (`text-lg font-medium`)

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/catering/CateringHero.tsx src/components/catering/PackageCard.tsx
git commit -m "feat: add CateringHero and PackageCard components"
```

---

### Task 14: Catering — InquiryForm

**Files:**
- Create: `src/components/catering/InquiryForm.tsx` (`'use client'`)

This is a `'use client'` component that calls a server action (built in Phase 7). For now, build the form UI with client-side validation. The server action submission will be wired in Phase 7.

```tsx
"use client";

// Form fields (from plan Phase 6 pre-work — to be confirmed in Phase 6 brainstorm):
// Name (required), Email (required), Phone, Event Date, Guest Count, Package Preference, Message
// Plus honeypot field (hidden, for spam protection)
```

Design Guide > Form Inputs:
- Background: `bg-muted`
- Border: `border-[1.5px] border-border`
- Radius: `rounded-md`
- Padding: `py-3 px-4`
- Font: `text-base font-body`
- Focus: `focus:border-primary focus:ring-[3px] focus:ring-primary/10`
- Error: `border-destructive`, error message `text-sm text-destructive mt-1`
- Placeholder: `placeholder:text-secondary`
- All inputs have visible `<label>` elements (no placeholder-only labels)

Form layout:
- 2 columns on desktop for short fields (name + email, phone + date), full width for message textarea
- Honeypot: hidden input `<input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />`
- Submit: `<Button variant="primary" size="lg">` with loading state
- Client-side validation: required field check, email format, at minimum
- Use `useActionState` (React 19) — stub the action for now, will connect in Phase 7

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/catering/InquiryForm.tsx
git commit -m "feat: add catering InquiryForm with validation"
```

---

### Task 15: Locations — LocationCard

**Files:**
- Create: `src/components/locations/LocationCard.tsx`

```tsx
interface LocationCardProps {
  name: string;
  address: string;
  phone?: string;
  googleMapsEmbed?: string;
  googleMapsLink?: string;
  hours?: Array<{ day: string; openTime: string; closeTime: string; isClosed: boolean }>;
  isPrimary?: boolean;
}
```

- Card treatment: `bg-white border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)]`
- Map at top: `<GoogleMap>` if embedUrl provided, 16:9 aspect
- Content padding: `p-6`
- Location name: `<h3>` with `font-heading text-xl md:text-2xl`
- If `isPrimary`, show a small "Primary" pill badge
- Address: text with MapPin icon
- Phone: click-to-call link with Phone icon
- Hours table: compact, `text-sm`, day left / time right
- "Get Directions" button: `<Button variant="outline" size="sm" href={googleMapsLink}>`

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/locations/LocationCard.tsx
git commit -m "feat: add LocationCard component"
```

---

### Task 16: Careers — JobCard

**Files:**
- Create: `src/components/careers/JobCard.tsx`

```tsx
interface JobCardProps {
  title: string;
  description?: any; // Portable Text
  location?: string;
  type?: "full-time" | "part-time" | "seasonal";
  applyUrl?: string;
  applyEmail?: string;
  postedDate?: string;
}
```

Design Guide > Grid: job listings are full-width, single column.

- Card: `bg-white border border-border rounded-lg p-6`
- Title: `<h3>` with `font-heading text-xl md:text-2xl`
- Type badge: pill-shaped, `bg-primary-light text-primary text-xs font-medium rounded-full px-3 py-1`
- Location: with MapPin icon, `text-sm text-secondary`
- Description: truncated or summary — use `<PortableTextRenderer>` or just show first paragraph
- Posted date: `text-sm text-secondary`
- Apply button: `<Button variant="primary">` — links to `applyUrl` or `mailto:applyEmail`

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/careers/JobCard.tsx
git commit -m "feat: add JobCard component"
```

---

### Task 17: SEO — JsonLd

**Files:**
- Create: `src/components/seo/JsonLd.tsx`

Outputs Restaurant schema.org structured data using the `schema-dts` package.

```tsx
import type { Restaurant } from "schema-dts";

interface JsonLdProps {
  name: string;
  description?: string;
  phone?: string;
  address?: string;
  url?: string;
  image?: string;
  priceRange?: string;
}
```

- Renders a `<script type="application/ld+json">` tag
- Uses `schema-dts` types for type safety
- Builds a `Restaurant` JSON-LD object with:
  - `@context`: "https://schema.org"
  - `@type`: "Restaurant"
  - `name`, `description`, `telephone`, `address` (as PostalAddress), `url`, `image`
  - `servesCuisine`: "Greek"
  - `priceRange`: "$$"

**Step: Verify**

Run: `npm run build`

**Step: Commit**

```bash
git add src/components/seo/JsonLd.tsx
git commit -m "feat: add JsonLd structured data component"
```

---

### Task 18: Wire Layout Components into Site Layout

**Files:**
- Modify: `src/app/(site)/layout.tsx`

Update the site layout to import and render AnnouncementBar + Navbar + Footer. This requires fetching siteSettings data.

```tsx
import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery, primaryLocationQuery } from "@/sanity/lib/queries";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
```

- Fetch `siteSettings` and `primaryLocation` at the layout level
- Pass relevant props to AnnouncementBar, Navbar, Footer
- Keep `<main>` wrapper around `{children}`
- Add skip-to-content link: `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to content</a>`
- Add `id="main-content"` to `<main>`

**Step: Verify**

Run: `npm run dev` — visually verify the navbar and footer render (even without CMS content, should show structural elements)

**Step: Commit**

```bash
git add src/app/(site)/layout.tsx
git commit -m "feat: wire layout components into site layout"
```

---

### Task 19: Build Verification

Run `npm run build` and fix any TypeScript or build errors across all components.

Run: `npm run build`
Expected: Build succeeds with no errors

If errors, fix them and commit:

```bash
git add -A
git commit -m "fix: resolve build errors in Phase 5 components"
```

---

## Task Summary

| # | Task | Files | Client? |
|---|------|-------|---------|
| 1 | Install lucide-react | package.json | — |
| 2 | Container, Button, SectionHeading | shared/ (3 files) | No |
| 3 | SanityImage, PortableTextRenderer, GoogleMap | shared/ (3 files) | No |
| 4 | AnnouncementBar | layout/ (2 files) | Partial |
| 5 | Navbar + MobileMenu | layout/ (3 files) | Partial |
| 6 | Footer | layout/ (1 file) | No |
| 7 | OrderStrip | layout/ (1 file) | No |
| 8 | DietaryIcon + MenuItemCard | menu/ (2 files) | No |
| 9 | CategoryTabs | menu/ (1 file) | Yes |
| 10 | Hero | home/ (2 files) | Partial |
| 11 | MenuHighlights | home/ (1 file) | No |
| 12 | LocationPreview | home/ (1 file) | No |
| 13 | CateringHero + PackageCard | catering/ (2 files) | No |
| 14 | InquiryForm | catering/ (1 file) | Yes |
| 15 | LocationCard | locations/ (1 file) | No |
| 16 | JobCard | careers/ (1 file) | No |
| 17 | JsonLd | seo/ (1 file) | No |
| 18 | Wire layout into site layout | (site)/layout.tsx | No |
| 19 | Build verification | — | — |

**Total: ~25 new files, 19 tasks**
