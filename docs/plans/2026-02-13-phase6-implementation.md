# Phase 6: Page Assembly — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Assemble all 9 pages by wiring existing components to Sanity data, plus update the InquiryForm to match brainstorming decisions (no packages, required fields).

**Architecture:** Each page is a server component that fetches data via `sanityFetch()` and passes props to existing components. Pages that need client interactivity (Menu) get a thin client wrapper. Toggle-gated pages (Catering, Careers, Allergens) check `siteSettings` and call `notFound()` when disabled.

**Tech Stack:** Next.js 16 App Router, Sanity v5, TypeScript, Tailwind CSS 4

**No test framework configured** — verification is `npm run build` + `npx tsc --noEmit` + visual check via `npm run dev`.

---

### Task 1: Homepage

**Files:**
- Modify: `src/app/(site)/page.tsx`

**Step 1: Replace starter template with homepage**

```tsx
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  siteSettingsQuery,
  featuredMenuItemsQuery,
  primaryLocationQuery,
} from "@/sanity/lib/queries";
import Hero from "@/components/home/Hero";
import MenuHighlights from "@/components/home/MenuHighlights";
import OrderStrip from "@/components/layout/OrderStrip";
import LocationPreview from "@/components/home/LocationPreview";

export default async function HomePage() {
  const [settings, featuredItems, primaryLocation] = await Promise.all([
    sanityFetch<any>({ query: siteSettingsQuery, tags: ["siteSettings"] }),
    sanityFetch<any[]>({ query: featuredMenuItemsQuery, tags: ["menuItem"] }),
    sanityFetch<any>({ query: primaryLocationQuery, tags: ["location"] }),
  ]);

  return (
    <>
      <Hero
        heroImage={settings?.heroImage}
        heroHeadline={settings?.heroHeadline}
        heroSubheadline={settings?.heroSubheadline}
        primaryCtaText={settings?.primaryCtaText}
        primaryCtaLink={settings?.primaryCtaLink}
        secondaryCtaText={settings?.secondaryCtaText}
        secondaryCtaLink={settings?.secondaryCtaLink}
      />
      <MenuHighlights
        heading={settings?.menuSectionHeading}
        viewMenuText={settings?.viewMenuText}
        items={featuredItems ?? []}
      />
      <OrderStrip
        deliveryApps={settings?.deliveryApps}
        phone={settings?.phone}
        orderButtonText={settings?.orderButtonText}
      />
      {primaryLocation && (
        <LocationPreview
          heading={settings?.locationSectionHeading}
          location={primaryLocation}
        />
      )}
    </>
  );
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/app/\(site\)/page.tsx
git commit -m "feat: assemble homepage with Hero, MenuHighlights, OrderStrip, LocationPreview"
```

---

### Task 2: Menu page with client-side category filtering

**Files:**
- Create: `src/app/(site)/menu/page.tsx`
- Create: `src/components/menu/MenuPageClient.tsx`

The Menu page needs client-side filtering. The server component fetches all data and passes it to a client wrapper that manages the active category tab and filters items.

**Step 1: Create the client wrapper**

Create `src/components/menu/MenuPageClient.tsx`:

```tsx
"use client";

import { useState } from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuItemCard from "@/components/menu/MenuItemCard";

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  photo?: any;
  dietaryTags?: string[];
  category?: { _id: string; name: string; slug: { current: string } };
}

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
}

interface MenuPageClientProps {
  categories: Category[];
  items: MenuItem[];
}

export default function MenuPageClient({
  categories,
  items,
}: MenuPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("");

  const filteredItems = activeCategory
    ? items.filter((item) => item.category?.slug?.current === activeCategory)
    : items;

  // Group items by category for display
  const groupedItems = activeCategory
    ? [{ category: categories.find((c) => c.slug.current === activeCategory), items: filteredItems }]
    : categories
        .map((cat) => ({
          category: cat,
          items: filteredItems.filter(
            (item) => item.category?.slug?.current === cat.slug.current
          ),
        }))
        .filter((group) => group.items.length > 0);

  return (
    <>
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <Container className="py-8 md:py-12">
        {groupedItems.map((group) => (
          <section key={group.category?._id ?? "all"} className="mb-12 last:mb-0">
            {!activeCategory && group.category && (
              <SectionHeading as="h2" className="mb-6">
                {group.category.name}
              </SectionHeading>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.items.map((item) => (
                <MenuItemCard
                  key={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  photo={item.photo}
                  dietaryTags={item.dietaryTags}
                />
              ))}
            </div>
          </section>
        ))}

        {filteredItems.length === 0 && (
          <p className="text-secondary text-center py-12">
            No menu items available.
          </p>
        )}
      </Container>
    </>
  );
}
```

**Step 2: Create the server page**

Create `src/app/(site)/menu/page.tsx`:

```tsx
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { menuCategoriesQuery, menuItemsQuery } from "@/sanity/lib/queries";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import MenuPageClient from "@/components/menu/MenuPageClient";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse our full menu of authentic Greek dishes.",
};

export default async function MenuPage() {
  const [categories, items] = await Promise.all([
    sanityFetch<any[]>({ query: menuCategoriesQuery, tags: ["menuCategory"] }),
    sanityFetch<any[]>({ query: menuItemsQuery, tags: ["menuItem"] }),
  ]);

  return (
    <>
      <section className="bg-muted py-12 md:py-16">
        <Container className="text-center">
          <SectionHeading as="h1">Our Menu</SectionHeading>
        </Container>
      </section>

      <MenuPageClient
        categories={categories ?? []}
        items={items ?? []}
      />
    </>
  );
}
```

**Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 4: Commit**

```bash
git add src/app/\(site\)/menu/page.tsx src/components/menu/MenuPageClient.tsx
git commit -m "feat: add menu page with category tabs and client-side filtering"
```

---

### Task 3: Update InquiryForm for custom catering

**Files:**
- Modify: `src/components/catering/InquiryForm.tsx`

Remove the `packagePreference` field. Make `phone`, `eventDate`, and `guestCount` required with validation.

**Step 1: Update InquiryForm**

Changes to make:
1. Remove `packagePreference` from `FormData` interface and `initialFormData`
2. Add `phone`, `eventDate`, `guestCount` to `FormErrors` interface
3. Add validation for the three new required fields
4. Update the form layout: remove the packagePreference select, make guestCount full-width in its row or pair it with something else
5. Add required asterisks to phone, eventDate, guestCount labels
6. Add error display for new required fields

Updated `FormData`:
```tsx
interface FormData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  message: string;
  website: string; // honeypot
}
```

Updated `FormErrors`:
```tsx
interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  eventDate?: string;
  guestCount?: string;
}
```

Updated `initialFormData`:
```tsx
const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  eventDate: "",
  guestCount: "",
  message: "",
  website: "",
};
```

Updated `validate`:
```tsx
function validate(): FormErrors {
  const newErrors: FormErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = "Name is required.";
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(formData.email.trim())) {
    newErrors.email = "Please enter a valid email address.";
  }

  if (!formData.phone.trim()) {
    newErrors.phone = "Phone number is required.";
  }

  if (!formData.eventDate) {
    newErrors.eventDate = "Event date is required.";
  }

  if (!formData.guestCount.trim()) {
    newErrors.guestCount = "Guest count is required.";
  }

  return newErrors;
}
```

Updated form layout (3 rows):
- Row 1: Name, Email (both required)
- Row 2: Phone (required), Event Date (required)
- Row 3: Guest Count (required) — single column
- Row 4: Message (optional) — full width

Each required field gets `<span className="text-destructive">*</span>` after label text, error styling on input, and error message below.

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/components/catering/InquiryForm.tsx
git commit -m "feat: update InquiryForm for custom catering (remove packages, require phone/date/count)"
```

---

### Task 4: Catering page

**Files:**
- Create: `src/app/(site)/catering/page.tsx`

**Step 1: Create catering page**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import CateringHero from "@/components/catering/CateringHero";
import InquiryForm from "@/components/catering/InquiryForm";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";

export const metadata: Metadata = {
  title: "Catering",
  description:
    "Custom Greek catering for every occasion. Tell us about your event and we'll build a menu for your group.",
};

export default async function CateringPage() {
  const settings = await sanityFetch<any>({
    query: siteSettingsQuery,
    tags: ["siteSettings"],
  });

  if (!settings?.enableCatering) {
    notFound();
  }

  return (
    <>
      <CateringHero
        heading="Catering for Every Occasion"
        description="From office lunches to family celebrations, we'll build a custom menu for your group. Tell us what you need and we'll take care of the rest."
      />
      <section className="py-12 md:py-16">
        <Container className="max-w-2xl">
          <SectionHeading className="mb-8">Get in Touch</SectionHeading>
          <InquiryForm />
        </Container>
      </section>
    </>
  );
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/app/\(site\)/catering/page.tsx
git commit -m "feat: add catering page with hero and inquiry form"
```

---

### Task 5: Locations page

**Files:**
- Create: `src/app/(site)/locations/page.tsx`

**Step 1: Create locations page**

```tsx
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { locationsQuery } from "@/sanity/lib/queries";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import LocationCard from "@/components/locations/LocationCard";

export const metadata: Metadata = {
  title: "Locations",
  description: "Find an Aristos location near you. Hours, directions, and contact info.",
};

export default async function LocationsPage() {
  const locations = await sanityFetch<any[]>({
    query: locationsQuery,
    tags: ["location"],
  });

  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionHeading as="h1" className="mb-8">
          Our Locations
        </SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(locations ?? []).map((loc) => (
            <LocationCard
              key={loc._id}
              name={loc.name}
              address={loc.address}
              phone={loc.phone}
              googleMapsEmbed={loc.googleMapsEmbed}
              googleMapsLink={loc.googleMapsLink}
              hours={loc.hours}
              isPrimary={loc.isPrimary}
            />
          ))}
        </div>

        {(!locations || locations.length === 0) && (
          <p className="text-secondary text-center py-12">
            Location information coming soon.
          </p>
        )}
      </Container>
    </section>
  );
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/app/\(site\)/locations/page.tsx
git commit -m "feat: add locations page"
```

---

### Task 6: Careers page

**Files:**
- Create: `src/app/(site)/careers/page.tsx`

**Step 1: Create careers page**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery, jobListingsQuery } from "@/sanity/lib/queries";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import JobCard from "@/components/careers/JobCard";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Aristos team. View current job openings.",
};

export default async function CareersPage() {
  const [settings, jobs] = await Promise.all([
    sanityFetch<any>({ query: siteSettingsQuery, tags: ["siteSettings"] }),
    sanityFetch<any[]>({ query: jobListingsQuery, tags: ["jobListing"] }),
  ]);

  if (!settings?.enableCareers) {
    notFound();
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionHeading as="h1" className="mb-8">
          Careers
        </SectionHeading>

        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 max-w-3xl">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                title={job.title}
                description={job.description}
                location={job.location}
                type={job.type}
                applyUrl={job.applyUrl}
                applyEmail={job.applyEmail}
                postedDate={job.postedDate}
              />
            ))}
          </div>
        ) : (
          <p className="text-secondary text-center py-12">
            No open positions right now. Check back soon.
          </p>
        )}
      </Container>
    </section>
  );
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/app/\(site\)/careers/page.tsx
git commit -m "feat: add careers page with toggle gate"
```

---

### Task 7: Allergens page

**Files:**
- Create: `src/app/(site)/allergens/page.tsx`

**Step 1: Create allergens page**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  siteSettingsQuery,
  pageContentQuery,
  menuItemsWithAllergensQuery,
} from "@/sanity/lib/queries";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import PortableTextRenderer from "@/components/shared/PortableTextRenderer";
import DietaryIcon from "@/components/menu/DietaryIcon";

export const metadata: Metadata = {
  title: "Allergens",
  description: "Allergen information for all Aristos menu items.",
};

export default async function AllergensPage() {
  const [settings, pageContent, items] = await Promise.all([
    sanityFetch<any>({ query: siteSettingsQuery, tags: ["siteSettings"] }),
    sanityFetch<any>({
      query: pageContentQuery,
      params: { slug: "allergens" },
      tags: ["pageContent"],
    }),
    sanityFetch<any[]>({
      query: menuItemsWithAllergensQuery,
      tags: ["menuItem"],
    }),
  ]);

  if (!settings?.enableAllergens) {
    notFound();
  }

  return (
    <section className="py-12 md:py-16">
      <Container className="max-w-3xl">
        <SectionHeading as="h1" className="mb-8">
          Allergen Information
        </SectionHeading>

        {pageContent?.body && (
          <PortableTextRenderer value={pageContent.body} className="mb-12" />
        )}

        {items && items.length > 0 && (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-3 text-sm font-semibold">Item</th>
                  <th className="px-4 py-3 text-sm font-semibold">Category</th>
                  <th className="px-4 py-3 text-sm font-semibold">Allergens</th>
                  <th className="px-4 py-3 text-sm font-semibold">Dietary</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-t border-border">
                    <td className="px-4 py-3 text-sm font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary">
                      {item.category?.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary">
                      {item.allergens?.join(", ")}
                    </td>
                    <td className="px-4 py-3">
                      {item.dietaryTags && item.dietaryTags.length > 0 && (
                        <div className="flex gap-1">
                          {item.dietaryTags.map((tag: string) => (
                            <DietaryIcon
                              key={tag}
                              tag={tag as "V" | "VG" | "GF"}
                            />
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </section>
  );
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/app/\(site\)/allergens/page.tsx
git commit -m "feat: add allergens page with toggle gate"
```

---

### Task 8: Privacy and Terms pages

**Files:**
- Create: `src/app/(site)/privacy/page.tsx`
- Create: `src/app/(site)/terms/page.tsx`

Both follow the same pattern — fetch `pageContent` by slug and render with PortableTextRenderer.

**Step 1: Create privacy page**

```tsx
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageContentQuery } from "@/sanity/lib/queries";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import PortableTextRenderer from "@/components/shared/PortableTextRenderer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Aristos Greek Restaurant.",
};

export default async function PrivacyPage() {
  const page = await sanityFetch<any>({
    query: pageContentQuery,
    params: { slug: "privacy" },
    tags: ["pageContent"],
  });

  return (
    <section className="py-12 md:py-16">
      <Container className="max-w-3xl">
        <SectionHeading as="h1" className="mb-8">
          {page?.title ?? "Privacy Policy"}
        </SectionHeading>
        {page?.body && <PortableTextRenderer value={page.body} />}
      </Container>
    </section>
  );
}
```

**Step 2: Create terms page**

```tsx
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageContentQuery } from "@/sanity/lib/queries";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import PortableTextRenderer from "@/components/shared/PortableTextRenderer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Aristos Greek Restaurant.",
};

export default async function TermsPage() {
  const page = await sanityFetch<any>({
    query: pageContentQuery,
    params: { slug: "terms" },
    tags: ["pageContent"],
  });

  return (
    <section className="py-12 md:py-16">
      <Container className="max-w-3xl">
        <SectionHeading as="h1" className="mb-8">
          {page?.title ?? "Terms of Service"}
        </SectionHeading>
        {page?.body && <PortableTextRenderer value={page.body} />}
      </Container>
    </section>
  );
}
```

**Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 4: Commit**

```bash
git add src/app/\(site\)/privacy/page.tsx src/app/\(site\)/terms/page.tsx
git commit -m "feat: add privacy and terms pages"
```

---

### Task 9: 404 page

**Files:**
- Create: `src/app/not-found.tsx`

**Step 1: Create branded 404 page**

```tsx
import Container from "@/components/shared/Container";
import Button from "@/components/shared/Button";

export default function NotFound() {
  return (
    <section className="py-24 md:py-32">
      <Container className="text-center">
        <p className="text-6xl md:text-8xl font-heading text-primary mb-4">
          404
        </p>
        <h1 className="font-heading text-2xl md:text-[32px] leading-[1.2] text-foreground">
          Looks like this page doesn't exist
        </h1>
        <p className="text-secondary mt-3 text-lg">
          But our food definitely does.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button variant="primary" href="/">
            Back to Home
          </Button>
          <Button variant="outline" href="/menu">
            View Our Menu
          </Button>
        </div>
      </Container>
    </section>
  );
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/app/not-found.tsx
git commit -m "feat: add branded 404 page"
```

---

### Task 10: Final build verification

**Step 1: Type check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 2: Production build**

Run: `npm run build`
Expected: All 9 routes build successfully

**Step 3: Lint**

Run: `npm run lint`
Expected: No errors
