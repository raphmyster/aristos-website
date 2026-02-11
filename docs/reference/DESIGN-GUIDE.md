# Aristos Souvlaki & Gyros — Design Reference Guide

## Overview

Design reference for the Aristos website — a casual Greek restaurant in Toronto known as a local favourite for the lunch crowd. Family-owned, fast-food style preparation, clean and modern space.

**Design Philosophy: Modern Mediterranean**
Warm white backgrounds, the Aristos blue as a confident accent, generous whitespace that lets food photography breathe. Clean modern typography with a distinctive serif for headings. The logo's traditional Greek character provides heritage; the site design provides polish.

**Core Principles:**
- Photography-first — the food sells itself, the design stays out of the way
- Warm and approachable — not sterile, not trendy, just confidently good
- Speed-oriented — the lunch crowd is hungry, every interaction should be fast
- Confidence without flash — no exclamation marks, no gimmicks, just quality

**Target Audience:** Local lunch crowd, catering inquiries, people searching "Greek food near me" on their phone.

---

## Color Palette

The Aristos logo is monochromatic blue. The palette builds around it — blue is the brand, green is the food, everything else is warm neutral.

### Core Colors

| Role | Hex | Usage |
|------|-----|-------|
| **Background** | `#FAF9F6` | Page base — slightly warm, not sterile |
| **Foreground** | `#1C1917` | Primary body text |
| **Primary** | `#1E3A8A` | Logo color, primary buttons, key accents, links |
| **Primary Light** | `#DBEAFE` | Hover states, tag backgrounds, section highlights, announcement bar (info) |
| **Secondary** | `#78716C` | Secondary text, captions, muted UI elements |
| **Accent** | `#4D7C0F` | Dietary tags (V/VG), "Available" indicators, success states — nods to fresh herbs |
| **Muted** | `#F0EEEB` | Card backgrounds, alternating sections, input fields |
| **Border** | `#E5E2DD` | Dividers, card borders, table lines |
| **Destructive** | `#DC2626` | Error states, form validation |

### Color Usage Rules

- **Primary blue** punctuates, it doesn't dominate. Used for CTAs, active states, links, and the occasional section accent. Never as a large background area (except hero button and announcement bar celebration style).
- **Warm whites and muted grays** create the canvas. They make food photography pop by staying neutral.
- **Accent green** is reserved for dietary/food context only. Don't use it for generic success states outside of menu items.
- **Alternating sections** on the homepage use `background` and `muted` — no colored section backgrounds.

---

## Typography

The logo handles the decorative heavy lifting. Site typography is clean and confident — not competing with the logo's Greek illustration style.

### Font Families

| Role | Font | Fallback |
|------|------|----------|
| **Heading** | DM Serif Display (400) | Georgia, serif |
| **Body** | DM Sans (400, 500, 600) | system-ui, sans-serif |

Both loaded via Google Fonts with `display: swap`. DM Sans pairs naturally with DM Serif Display (same design family) — slightly geometric, friendly roundness, excellent screen readability.

### Type Scale

| Role | Size (mobile → desktop) | Weight | Font | Usage |
|------|------------------------|--------|------|-------|
| **Hero headline** | 36px → 56px | 400 | DM Serif Display | Homepage hero only |
| **Page title (h1)** | 30px → 40px | 400 | DM Serif Display | Page headers |
| **Section heading (h2)** | 24px → 32px | 400 | DM Serif Display | "Our Menu", "Find Us" |
| **Card title (h3)** | 20px → 24px | 400 | DM Serif Display | Menu item names, package titles |
| **Subheading (h4)** | 16px → 18px | 600 | DM Sans | Category labels, subsections |
| **Body** | 16px | 400 | DM Sans | Descriptions, paragraphs |
| **Body small** | 14px | 400 | DM Sans | Hours, addresses, secondary info |
| **Caption** | 12px | 500 | DM Sans | Dietary tags, badges, fine print |
| **Button** | 16px | 500 | DM Sans | All button labels |
| **Price** | 18px → 20px | 500 | DM Sans | Menu item prices |
| **Nav link** | 15px | 500 | DM Sans | Navbar links |

### Typography Rules

- DM Serif Display is always weight 400 (it only ships in 400) — its natural contrast does the work
- DM Sans: 400 for body, 500 for UI elements (buttons, prices, nav), 600 for emphasis
- Line heights: headings 1.2, body 1.6, captions 1.4
- Letter spacing: headings -0.01em (slightly tight), body normal, captions 0.02em (slightly open)
- Size breakpoint: mobile → desktop shift happens at 768px — a single step, not fluid/clamp

---

## Spacing System

Base unit: 4px with an 8px primary rhythm.

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Icon gaps, tag padding inline, tight element pairs |
| `sm` | 8px | Inner padding for small elements, gap between related items |
| `md` | 16px | Default component padding, form field spacing |
| `lg` | 24px | Card padding, gap between cards in a grid |
| `xl` | 32px | Component margins, content block spacing |
| `2xl` | 48px | Section padding (mobile) |
| `3xl` | 64px | Section padding (desktop) |
| `4xl` | 96px | Hero vertical padding, major visual breaks |

### Section Rhythm

Every homepage block uses `3xl` (64px) top/bottom padding on desktop, `2xl` (48px) on mobile. Alternating sections use the `muted` background color to create visual separation without heavy borders.

---

## Layout System

### Container Widths

| Breakpoint | Screen Width | Container Max | Side Padding |
|------------|-------------|---------------|-------------|
| Mobile | < 768px | 100% | 16px |
| Tablet | 768px – 1023px | 720px | 24px |
| Desktop | 1024px – 1439px | 960px | 32px |
| Wide | 1440px+ | 1200px | 32px |

### Grid System

| Component | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| Featured items (home) | 4 columns | 2 columns | 1 column (horizontal scroll optional) |
| Menu item cards | 3 columns | 2 columns | 1 column |
| Catering packages | 2 columns | 2 columns | 1 column |
| Location cards | 2 columns | 1 column | 1 column |
| Job listings | 1 column (full width) | 1 column | 1 column |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 6px | Small buttons, input fields, dietary tag inner elements |
| `md` | 8px | Buttons, form inputs, small containers |
| `lg` | 12px | Cards, image containers, larger interactive areas |
| `xl` | 16px | Mobile menu panel, large feature sections |
| `full` | 9999px | Pills (dietary tags, category tabs), circular icon buttons |

---

## Shadow System

All shadows use warm-tinted black (not pure black, not blue-tinted) to feel natural against warm white backgrounds.

| Level | Value | Usage |
|-------|-------|-------|
| **None** | `none` | Flat elements, inline items |
| **Subtle** | `0 1px 3px rgba(0,0,0,0.06)` | Cards at rest, form inputs |
| **Medium** | `0 4px 12px rgba(0,0,0,0.1)` | Cards on hover, dropdowns |
| **Heavy** | `0 8px 24px rgba(0,0,0,0.12)` | Mobile menu overlay, modals |
| **Nav** | `0 1px 4px rgba(0,0,0,0.05)` | Navbar on scroll only |

**Philosophy:** Borders are structural, shadows provide lift. Cards get both (thin border + subtle shadow) because on a warm white page, a card needs the border for definition at rest and the shadow for hover feedback.

---

## Component Specifications

### Buttons

**Variants:**

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| **Primary** | Primary blue `#1E3A8A` | White | None | Main CTAs — "Order Now", "View Menu", "Submit" |
| **Secondary** | Transparent | Primary blue | 1.5px solid primary | Alternative actions — "View Catering", "See All Locations" |
| **Outline** | Transparent | Foreground | 1.5px solid border | Neutral actions — "Learn More", "Read Terms" |
| **Ghost** | Transparent | Secondary `#78716C` | None | Subtle — "Dismiss", filter resets |

**Sizing:**

| Size | Padding | Font | Radius | Usage |
|------|---------|------|--------|-------|
| **Default** | 12px 24px | 16px / 500 | 8px | Most buttons |
| **Large** | 16px 32px | 16px / 500 | 8px | Hero CTAs, prominent actions |
| **Small** | 8px 16px | 14px / 500 | 6px | Inline actions, card buttons |

**States:**

| State | Effect |
|-------|--------|
| **Hover** | Darken background 10%, slight scale 1.02, 150ms ease |
| **Focus** | 2px ring offset, primary blue ring (keyboard accessibility) |
| **Active/Pressed** | Darken 15%, scale 0.98 |
| **Disabled** | 50% opacity, no pointer events |

### Cards

Applies to menu items, catering packages, and location cards.

| Property | Value |
|----------|-------|
| Background | White `#FFFFFF` |
| Border | 1px solid `#E5E2DD` |
| Radius | 12px |
| Padding | 24px (content area below image) |
| Shadow (resting) | `0 1px 3px rgba(0,0,0,0.06)` |
| Shadow (hover) | `0 4px 12px rgba(0,0,0,0.1)`, translate Y -2px, 200ms ease |
| Image | Top of card, 3:2 aspect ratio, `object-fit: cover`, 12px top radius |

### Form Inputs

| Property | Value |
|----------|-------|
| Background | `#F0EEEB` (muted) |
| Border | 1.5px solid `#E5E2DD` |
| Radius | 8px |
| Padding | 12px 16px |
| Font | 16px / 400 DM Sans |
| Focus | Border transitions to primary blue, subtle blue glow `0 0 0 3px rgba(30,58,138,0.1)` |
| Error | Border red, error message in 14px destructive color below |
| Placeholder | `#78716C` secondary color |

### Dietary Tag Pills

| Tag | Label | Background | Text |
|-----|-------|-----------|------|
| **Vegetarian** | V | `#ECFDF5` | `#065F46` |
| **Vegan** | VG | `#D1FAE5` | `#065F46` |
| **Gluten Free** | GF | `#FEF3C7` | `#92400E` |

- Shape: Pill (`border-radius: full`), padding 2px 10px
- Font: 12px / 500 DM Sans, uppercase
- Gap: 6px between tags
- Color logic: Green family for plant-based (quick visual scan), amber for allergen-related

---

## Navigation

### Navbar (sticky)

| Property | Value |
|----------|-------|
| Background | `#FAF9F6` warm white, 95% opacity + `backdrop-filter: blur(10px)` when scrolled |
| Height | 72px desktop, 64px mobile |
| Border bottom | 1px solid `#E5E2DD` (appears on scroll) |
| Shadow on scroll | `0 1px 4px rgba(0,0,0,0.05)` |
| Logo | Left-aligned, max-height 48px desktop / 40px mobile |
| Nav links | Right-aligned, 15px/500 DM Sans, foreground color |
| Link hover | Underline slides in from left, 2px primary blue, offset 4px below text |
| Active link | Primary blue text |
| CTA button | Rightmost item — primary button "Order Now" (small size) |

### Mobile Menu

- Hamburger icon: 3 lines, 24px, animated to X on open (200ms)
- Menu: Full-screen overlay, warm white background, slides in from right (250ms ease-out, 200ms ease-in close)
- Links: Stacked, 24px DM Serif Display, 48px tap targets, centered
- CTA: Full-width primary button at bottom

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (1024px+) | Logo left, nav links + "Order Now" CTA right, horizontal |
| Tablet (768–1023px) | Logo left, hamburger right (same as mobile) |
| Mobile (< 768px) | Logo left, hamburger right, full-screen slide-out menu |

---

## Hero Section (homepage only)

| Property | Value |
|----------|-------|
| Layout | Full-width image with dark overlay |
| Height | 85vh desktop, 70vh mobile (min 500px) |
| Image | Full bleed, `object-fit: cover`, `object-position: center` |
| Overlay | Linear gradient: `rgba(0,0,0,0.15)` top → `rgba(0,0,0,0.55)` bottom |
| Content position | Bottom-left on desktop (padding: 4xl bottom, 3xl left), centered on mobile |
| Headline | 36→56px DM Serif Display, white, text-shadow `0 2px 8px rgba(0,0,0,0.3)` |
| Subheadline | 16px DM Sans 400, white at 90% opacity, max-width 480px |
| CTAs | Primary "Order Now" (large) + Secondary white text/border "View Menu" (large). Side by side desktop, stacked mobile. |

**Key design choice:** The overlay gradient is heavier at the bottom where text sits, lighter at top so the food photography stays vibrant. You see the dish first, then read the headline.

---

## Footer

| Property | Value |
|----------|-------|
| Background | Foreground `#1C1917` (dark — creates strong visual close) |
| Text | White at 90% opacity |
| Secondary links | White at 60% opacity |
| Padding | `3xl` (64px) top/bottom |

**Columns (4 on desktop, 2 on tablet, stacked on mobile):**

1. **Brand** — Logo (white/inverted version or wordmark), tagline, social icons row
2. **Menu** — Links: Menu, Catering, Locations
3. **Info** — Links: Careers, Allergens, Privacy, Terms (secondary nav — not in navbar)
4. **Contact** — Address, phone (click-to-call), hours summary ("Daily 11am–10pm")

**Bottom bar:** Copyright line, subtle top border at 10% white opacity.

---

## Announcement Bar

Sits above the navbar. Dismissable (sessionStorage — reappears next visit).

| Style | Background | Text | Usage |
|-------|-----------|------|-------|
| **Info** | `#DBEAFE` (primary light) | Primary blue | General — "Now on DoorDash!" |
| **Warning** | `#FEF3C7` (warm yellow) | `#92400E` (amber dark) | Closures — "Closed Dec 25" |
| **Celebration** | `#1E3A8A` (primary blue) | White | Events — "Catering now available!" |

- Height: 40px, centered text, 14px/500 DM Sans
- Dismiss: Small X button on right
- Optional link: Underlined text, inherits color

---

## Order Strip

| Property | Value |
|----------|-------|
| Background | Muted `#F0EEEB` |
| Layout | Horizontal row — delivery app logos + "Or call us" phone button |
| Padding | `lg` (24px) top/bottom |
| Delivery logos | 32px height, grayscale at rest, full color on hover (200ms) |
| Phone button | Secondary button style, phone icon + number |

Sits between homepage sections as a gentle nudge — not aggressive, just present.

---

## Menu Page

### Category Tabs

| Property | Value |
|----------|-------|
| Layout | Horizontal row, scrollable on mobile (hidden scrollbar), centered desktop |
| Tab shape | Pill — `border-radius: full`, padding 8px 20px |
| Inactive | Transparent background, 1px solid border, foreground text |
| Active | Primary blue background, white text |
| Hover (inactive) | Muted background `#F0EEEB` |
| Font | 14px / 500 DM Sans |
| Gap | 8px between tabs |
| Sticky | Sticks below navbar on scroll, white background, subtle bottom border |

Mobile: Left-aligned with subtle fade on right edge to hint at scrollability.

### Menu Item Card

| Property | Value |
|----------|-------|
| Image | 3:2 aspect ratio, rounded top corners (12px) |
| Content padding | 20px |
| Item name | h3 (20→24px DM Serif Display) |
| Description | 14px, secondary color, 2-line clamp with ellipsis |
| Price | 18→20px, DM Sans 500, foreground color |
| Dietary tags | Row below price, left-aligned |
| Unavailable | Image 60% opacity, "Currently Unavailable" overlay, card 80% opacity |

---

## Image Treatment

### Hero Image

| Property | Value |
|----------|-------|
| Aspect ratio | Viewport-based (85vh / 70vh) |
| Overlay | Bottom-heavy gradient (see Hero Section) |
| Best subjects | Close-up plated food, overhead angle, vibrant ingredients |
| Fallback | Solid primary blue background with centered logo |

### Menu Item Photos

| Property | Value |
|----------|-------|
| Aspect ratio | 3:2 |
| Fit | `object-fit: cover`, `object-position: center` |
| Placeholder | Muted background with subtle fork-and-knife icon in border color |
| Loading | Blur-up — low-res Sanity placeholder transitions to full image |

### Catering Package Images

| Property | Value |
|----------|-------|
| Aspect ratio | 16:9 (wider — shows spread/platter context) |
| Subject | Platters, group settings, quantity — "this feeds a crowd" |

### General Rules

- All images via Sanity CDN + Next.js `<Image>` optimization
- Hotspot/crop per image in Sanity Studio
- Max rendered widths: hero 1920px, card images 640px, catering 960px
- Format: WebP with JPEG fallback (automatic via Next.js)
- Photography should feel natural and well-lit — real food, generous portions, visible textures

---

## Animation & Transitions

### Micro-interactions

| Interaction | Property | Duration | Easing |
|-------------|----------|----------|--------|
| Button hover | Background darken, scale 1.02 | 150ms | ease |
| Button press | Scale 0.98 | 100ms | ease |
| Card hover | Shadow elevation, translate Y -2px | 200ms | ease-out |
| Link hover | Underline slides in from left | 200ms | ease |
| Nav border/shadow | Appears on scroll | 200ms | ease |
| Form input focus | Border color + glow | 150ms | ease |
| Delivery logo hover | Grayscale to color | 200ms | ease |
| Mobile menu open | Slide from right | 250ms | ease-out |
| Mobile menu close | Slide to right | 200ms | ease-in |
| Announcement dismiss | Fade out + collapse height | 200ms | ease |

### Page Load (homepage only)

| Element | Animation | Delay |
|---------|-----------|-------|
| Hero image | Fade in + scale 1.05 → 1.0 | 0ms |
| Hero headline | Fade up (Y 20px → 0) | 200ms |
| Hero subheadline | Fade up | 350ms |
| Hero CTAs | Fade up | 500ms |

### Rules

- No scroll-triggered animations on content sections — the lunch crowd scrolls fast
- Smooth scroll for anchor links (CSS `scroll-behavior: smooth`)
- Category tabs sticky transition is instant (no animation)
- Respect `prefers-reduced-motion: reduce` — disable transforms and fades, keep instant state changes

**Principle:** Animation serves speed, not spectacle. Fast, subtle, functional.

---

## Iconography

| Property | Value |
|----------|-------|
| Library | Lucide React |
| Style | Outlined (stroke only) |
| Stroke width | 2px |
| Default size | 20px (nav, inline), 24px (buttons, standalone) |
| Color | Inherits from parent text color |

### Common Icons

| Context | Icon |
|---------|------|
| Hamburger menu | `Menu` → `X` (animated) |
| Phone/call | `Phone` |
| Map pin | `MapPin` |
| Clock | `Clock` |
| External link | `ExternalLink` |
| Dismiss/close | `X` |
| Social: Instagram | `Instagram` |
| Chevron | `ChevronRight` |

Dietary tags use color-coded text pills, not icons — clearer at small sizes.

---

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Color contrast | WCAG AA minimum. White on primary blue = 9.7:1. Foreground on background = 15.4:1. |
| Focus indicators | 2px primary blue ring, 2px offset — all interactive elements |
| Touch targets | Minimum 44x44px for all tappable elements |
| Reduced motion | `prefers-reduced-motion: reduce` disables transforms and animations |
| Alt text | All Sanity images require alt text. Decorative images use `alt=""` |
| Semantic HTML | Proper heading hierarchy, landmarks (`nav`, `main`, `footer`), `aria-labels` on icon-only buttons |
| Skip link | Hidden "Skip to content" link, visible on focus, jumps past nav to `main` |
| Form labels | All inputs have visible labels (no placeholder-only labels) |

---

## Messaging & Copy Tone

- Warm, direct, unpretentious — matches the restaurant
- CTAs are action-first: "Order Now", "View Menu", "See Our Catering"
- No exclamation marks in headings. Confidence, not excitement.
- Empty states are helpful: "No job openings right now — check back soon."
- Descriptions are short — two sentences max. The food photos do the selling.

---

## Implementation Tokens

Reference for cross-checking `src/lib/theme.ts` and `src/app/globals.css`:

```css
:root {
  /* Colors */
  --color-primary: #1E3A8A;
  --color-primary-light: #DBEAFE;
  --color-secondary: #78716C;
  --color-accent: #4D7C0F;
  --color-background: #FAF9F6;
  --color-foreground: #1C1917;
  --color-muted: #F0EEEB;
  --color-muted-foreground: #78716C;
  --color-border: #E5E2DD;
  --color-destructive: #DC2626;

  /* Fonts */
  --font-heading: "DM Serif Display", Georgia, serif;
  --font-body: "DM Sans", system-ui, sans-serif;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

---

## Summary

| Category | Decision |
|----------|----------|
| Aesthetic | Modern Mediterranean — warm, clean, photography-first |
| Color | Greek blue accent on warm white canvas, green for dietary |
| Fonts | DM Serif Display (headings) + DM Sans (body) |
| Spacing | 4px base, 8px primary rhythm |
| Layout | 1200px max container, 4/3/2/1 column responsive grid |
| Shadows | Warm-tinted, subtle at rest, elevated on hover |
| Radius | 6–12px components, pills for tags/tabs |
| Icons | Lucide React, outlined, 2px stroke |
| Animation | Subtle and fast — serves speed, not spectacle |
| Photography | Food-forward, 3:2 cards, blur-up loading |
| Voice | Warm, direct, confident, short |
