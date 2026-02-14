# How This Website Works (ELI5)

A beginner-friendly guide to how all the pieces of this project fit together.

---

## The Big Picture

Think of this website like a restaurant (fitting, right?). There are three main parts:

1. **The dining room** (Next.js) — what visitors see and interact with
2. **The kitchen** (Sanity CMS) — where content is prepared and managed
3. **The menu board** (Tailwind CSS + Theme) — how everything looks

When someone visits your website, Next.js serves them a page. The content on that page came from Sanity. The styling comes from your theme. That's it at the highest level.

---

## The Tech Stack (What Each Tool Does)

| Tool | What it is | Restaurant analogy |
|------|-----------|-------------------|
| **Next.js 16** | The web framework that builds and serves your pages | The building itself — walls, doors, layout |
| **React 19** | The UI library that creates interactive components | The furniture and decor inside |
| **Sanity v5** | The content management system (CMS) where you edit text, images, menus | The kitchen where food is prepared |
| **Tailwind CSS 4** | The styling system that makes things look good | The paint, lighting, and interior design |
| **TypeScript** | JavaScript with type safety — catches errors before they happen | The building code inspector |

---

## How a Page Gets to a Visitor

Here's what happens when someone visits `aristos.com/menu`:

```
1. Visitor types aristos.com/menu in their browser
         |
         v
2. Next.js finds the matching page file:
   src/app/(site)/menu/page.tsx
         |
         v
3. That page asks Sanity for data:
   "Hey Sanity, give me all menu items"
         |
         v
4. Sanity returns the data (menu items, prices, images, etc.)
         |
         v
5. Next.js builds the HTML with that data + your styling
         |
         v
6. The visitor sees a beautiful menu page
```

This all happens on the **server** before the page reaches the visitor's browser. That's why it's fast — the browser gets a fully-built page instead of an empty shell that has to load data afterward.

---

## Folder Structure (Where Things Live)

```
src/
├── app/            <-- Pages and routes (the "rooms" of your website)
├── components/     <-- Reusable UI pieces (buttons, cards, navbar)
├── sanity/         <-- Everything related to your CMS
└── lib/            <-- Helper utilities (theme, formatting functions)
```

### Pages: `src/app/`

Next.js uses **file-based routing**. This means the folder structure = the URL structure:

| File | URL |
|------|-----|
| `src/app/(site)/page.tsx` | `/` (homepage) |
| `src/app/(site)/menu/page.tsx` | `/menu` |
| `src/app/(site)/catering/page.tsx` | `/catering` |
| `src/app/(site)/locations/page.tsx` | `/locations` |
| `src/app/(site)/careers/page.tsx` | `/careers` |
| `src/app/(studio)/studio/[[...tool]]/page.tsx` | `/studio` (CMS editor) |

The `(site)` and `(studio)` folders in parentheses are called **route groups**. They don't affect the URL — they just organize things:

- **`(site)`** = all public pages. These share a common layout with the navbar and footer.
- **`(studio)`** = the Sanity CMS editor. No navbar or footer — it's a separate interface.

### Components: `src/components/`

Components are reusable building blocks. They're organized by which page they belong to:

```
components/
├── shared/      <-- Used everywhere (Button, Container, SectionHeading)
├── layout/      <-- Site frame (Navbar, Footer, AnnouncementBar)
├── home/        <-- Homepage only (Hero, MenuHighlights, LocationPreview)
├── menu/        <-- Menu page only (MenuItemCard, CategoryTabs)
├── catering/    <-- Catering page only (PackageCard, InquiryForm)
├── locations/   <-- Locations page (LocationCard)
├── careers/     <-- Careers page (JobCard)
└── seo/         <-- Search engine optimization (JsonLd)
```

### Sanity: `src/sanity/`

This is everything related to your CMS:

```
sanity/
├── schemas/     <-- Defines WHAT content looks like (menu item has name, price, image...)
├── lib/
│   ├── client.ts    <-- The connection to Sanity
│   ├── fetch.ts     <-- The function that gets data FROM Sanity
│   ├── queries.ts   <-- The questions we ask Sanity ("give me all menu items")
│   └── image.ts     <-- Turns Sanity image data into usable URLs
└── env.ts           <-- Project ID and dataset name
```

---

## Server Components vs. Client Components

This is a key concept in React 19 / Next.js. There are two types of components:

### Server Components (the default)

- Run on the **server** only
- Can fetch data directly from Sanity
- The visitor's browser never sees this code
- Great for: pages, data fetching, SEO

### Client Components (opt-in with `"use client"`)

- Run in the **visitor's browser**
- Can handle clicks, animations, form inputs, scroll effects
- Cannot fetch data from Sanity directly
- Great for: interactivity, animations, forms

### How they work together

A common pattern in this project is the **server/client split**:

```
Hero.tsx (Server Component)
  |-- Fetches hero image and text from Sanity
  |-- Passes that data as props to...
  |
  └── HeroClient.tsx (Client Component)
        |-- Receives data as props
        |-- Handles animations and interactivity
```

The server component gets the data. The client component makes it interactive. Data always flows **down** from server to client through props.

---

## The CMS: Sanity

Sanity is where you (or a restaurant owner) manage content without touching code. You access it at `/studio`.

### Content Types (Schemas)

Schemas define the **shape** of your content. Think of them as forms:

| Schema | What it stores |
|--------|---------------|
| `siteSettings` | Global stuff — site name, hero image, announcement bar text, SEO defaults |
| `menuCategory` | Menu sections like "Appetizers", "Entrees", "Desserts" |
| `menuItem` | Individual dishes — name, description, price, dietary info, image |
| `location` | Restaurant addresses, hours, phone numbers, map links |
| `cateringPackage` | Catering options with pricing and descriptions |
| `jobListing` | Open job positions |
| `pageContent` | Generic page content (privacy policy, terms, etc.) |

### How Data Gets From Sanity to Your Page

1. **Queries** (`src/sanity/lib/queries.ts`) — Written in GROQ (Sanity's query language). These are like asking a question: "Give me all menu items that are available, sorted by category."

2. **Fetch** (`src/sanity/lib/fetch.ts`) — The `sanityFetch()` function sends the query to Sanity and gets data back. It also handles caching so you're not asking Sanity the same question on every page load.

3. **Tags** — Each fetch is labeled with a tag like `"menuItem"`. When a menu item changes in Sanity, only pages with that tag get refreshed.

---

## Caching and Revalidation (How Updates Go Live)

When you publish a change in Sanity (like updating a menu item price), here's what happens:

```
1. You change a price in Sanity Studio and hit "Publish"
         |
         v
2. Sanity sends a webhook (automatic notification) to:
   /api/revalidate
         |
         v
3. The webhook says: "Hey, a menuItem changed!"
         |
         v
4. Next.js invalidates the cache for all pages tagged with "menuItem"
         |
         v
5. Next time someone visits /menu, Next.js rebuilds the page with fresh data
         |
         v
6. The visitor sees the updated price — no redeploy needed
```

This system is called **ISR** (Incremental Static Regeneration). Pages are pre-built for speed, but automatically refresh when content changes.

---

## The Theme System (How Styling Works)

The entire visual identity is controlled by **two files**:

### 1. CSS Variables (`src/app/globals.css`)

```css
:root {
  --color-primary: #1E3A8A;      /* Greek blue */
  --color-background: #FAF9F6;   /* Warm white */
  --font-heading: "DM Serif Display";
  --font-body: "DM Sans";
}
```

### 2. TypeScript Constants (`src/lib/theme.ts`)

Same values available in JavaScript for when you need them in code.

### Using the Theme

Instead of writing `color: #1E3A8A` everywhere, you write Tailwind classes:

```html
<div class="bg-primary text-white font-heading">
  Greek Restaurant
</div>
```

`bg-primary` automatically maps to that Greek blue color. To rebrand the entire site for a different restaurant, you change the two theme files and everything updates.

---

## Layouts (Shared Wrappers)

Layouts wrap pages with common elements that don't change between page navigations.

### Root Layout (`src/app/layout.tsx`)

Wraps **everything** — loads fonts, sets the HTML lang, adds analytics.

### Site Layout (`src/app/(site)/layout.tsx`)

Wraps **public pages only** — adds the Navbar at the top and Footer at the bottom. Also fetches global settings from Sanity (site name, navigation links, etc.) so each page doesn't have to.

```
┌──────────────────────────────┐
│        Announcement Bar      │  ← From Sanity siteSettings
├──────────────────────────────┤
│           Navbar             │  ← Shared across all pages
├──────────────────────────────┤
│                              │
│       Page Content           │  ← Different for each page
│       (children)             │
│                              │
├──────────────────────────────┤
│           Footer             │  ← Shared across all pages
└──────────────────────────────┘
```

---

## API Routes

The project has one API route:

- **`/api/revalidate`** — Receives webhooks from Sanity when content changes and tells Next.js which cached pages to refresh.

And one Server Action:

- **`src/actions/sendCateringInquiry.ts`** — Handles the catering inquiry form submission. Sends an email using Resend.

---

## How to Rebrand for a New Client

Since this is a template you're using for multiple restaurants:

1. **Create a new Sanity project** at sanity.io/manage
2. **Update `.env.local`** with the new project ID
3. **Change the theme** in `src/app/globals.css` and `src/lib/theme.ts` (new colors, fonts)
4. **Seed content** in Sanity Studio with the new restaurant's info
5. **Deploy** — everything else works the same

---

## Summary

```
Visitor's Browser
       ↕
   Next.js (builds and serves pages)
       ↕
   Sanity CMS (stores all content)

+ Tailwind CSS (styling via theme tokens)
+ TypeScript (catches bugs early)
+ Vercel (hosting and deployment)
```

The key insight: **content lives in Sanity, code lives in Next.js, and they're connected by `sanityFetch()`.** Everything else is supporting infrastructure to make this fast, pretty, and easy to update.
