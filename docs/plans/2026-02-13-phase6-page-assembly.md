# Phase 6: Page Assembly — Design Decisions

## Homepage Section Order

Hero → MenuHighlights → OrderStrip → LocationPreview

The food photos build appetite before showing ordering options. OrderStrip catches visitors at peak hunger. LocationPreview at the bottom serves the "where are you?" crowd.

## Homepage Copy

| Element | Copy |
|---------|------|
| Hero headline | "Authentic Greek, Made Fresh Daily" |
| Hero subheadline | "Souvlaki, gyros, and classic Greek dishes crafted with care in every bite" |
| Primary CTA | "View Our Menu" (links to /menu) |
| Secondary CTA | "Order Now" (links to delivery/order strip anchor or external) |
| MenuHighlights heading | "What We're Serving" |
| LocationPreview heading | "Visit Us" |
| OrderStrip heading | None — delivery logos and phone button are self-explanatory |

All copy is CMS-driven via siteSettings. These are the seeded defaults.

## Catering Page

**Structure:** CateringHero → InquiryForm (no PackageCards)

Aristos does fully custom catering — no fixed packages. The hero communicates flexibility and the form is the main action.

- Hero heading: "Catering for Every Occasion"
- Hero subtext: "From office lunches to family celebrations, we'll build a custom menu for your group. Tell us what you need and we'll take care of the rest."

## Catering Form Fields

| Field | Type | Required |
|-------|------|----------|
| Name | text | Yes |
| Email | email | Yes |
| Phone | tel | Yes |
| Event date | date | Yes |
| Guest count | number | Yes |
| Message | textarea | No |

Honeypot field (spam protection) is already built into InquiryForm from Phase 5.

## 404 Page

Warm and on-brand, not overly playful.

- Heading: "Looks like this page doesn't exist"
- Subtext: "But our food definitely does."
- Buttons: "Back to Home" (primary) + "View Our Menu" (secondary/outline)

## Pages to Build

1. **Home** (`src/app/(site)/page.tsx`) — Hero + MenuHighlights + OrderStrip + LocationPreview
2. **Menu** (`src/app/(site)/menu/page.tsx`) — CategoryTabs + MenuItemCards grouped by category
3. **Catering** (`src/app/(site)/catering/page.tsx`) — check enableCatering toggle, CateringHero + InquiryForm
4. **Locations** (`src/app/(site)/locations/page.tsx`) — LocationCards for all locations
5. **Careers** (`src/app/(site)/careers/page.tsx`) — check enableCareers toggle, JobCards or "no openings" message
6. **Allergens** (`src/app/(site)/allergens/page.tsx`) — check enableAllergens toggle, intro text + menu items with allergen tags
7. **Privacy** (`src/app/(site)/privacy/page.tsx`) — PortableTextRenderer with prose styling
8. **Terms** (`src/app/(site)/terms/page.tsx`) — PortableTextRenderer with prose styling
9. **404** (`src/app/not-found.tsx`) — branded not-found page
