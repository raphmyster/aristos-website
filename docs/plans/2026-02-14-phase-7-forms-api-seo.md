# Phase 7: Forms, API Routes, SEO & Polish — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire the catering inquiry form to a server action that sends email via Resend, add a Sanity revalidation webhook, add dynamic sitemap, enhance SEO metadata on the homepage, and render JSON-LD structured data in the site layout.

**Architecture:** Server action handles form submission with honeypot + rate limiting, sends email via Resend using a React Email template. A POST webhook route accepts Sanity content change notifications and calls `revalidateTag()`. Homepage gets dynamic `generateMetadata` from Sanity seoTitle/seoDescription/seoImage fields. Sitemap respects page toggles. JsonLd component (already built) gets rendered in the site layout.

**Tech Stack:** Next.js 16 (App Router, server actions), Resend, @react-email/components, next-sanity

---

## What's Already Done (no work needed)

- All page toggles: schemas, queries, conditional nav rendering, `notFound()` guards
- Static metadata on all sub-pages (Menu, Catering, Locations, Careers, Allergens, Privacy, Terms)
- Root layout `title.template` (`%s | Aristos Greek Restaurant`)
- InquiryForm UI with honeypot field and client-side validation
- JsonLd component (`src/components/seo/JsonLd.tsx`)
- All GROQ queries including siteSettings with seoTitle/seoDescription/seoImage
- All dependencies installed (resend, @react-email/components, schema-dts)

---

### Task 1: Add SANITY_REVALIDATE_SECRET to .env.example

**Files:**
- Modify: `/.env.example`

**Step 1: Add the environment variable**

Add a `SANITY_REVALIDATE_SECRET` entry to `.env.example` after the existing Sanity vars:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=

# Resend
RESEND_API_KEY=

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Step 2: Verify**

Run: `npm run build`
Expected: Builds without errors (no code changes yet, just env example).

**Step 3: Commit**

```bash
git add .env.example
git commit -m "chore: add SANITY_REVALIDATE_SECRET to .env.example"
```

---

### Task 2: Create the React Email template

**Files:**
- Create: `src/emails/CateringInquiry.tsx`

**Step 1: Build the email template**

Create `src/emails/CateringInquiry.tsx`:

```tsx
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
} from "@react-email/components";

interface CateringInquiryEmailProps {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  message?: string;
}

export default function CateringInquiryEmail({
  name,
  email,
  phone,
  eventDate,
  guestCount,
  message,
}: CateringInquiryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Catering inquiry from {name}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>New Catering Inquiry</Heading>
          <Hr style={hrStyle} />
          <Section>
            <Text style={labelStyle}>Name</Text>
            <Text style={valueStyle}>{name}</Text>

            <Text style={labelStyle}>Email</Text>
            <Text style={valueStyle}>{email}</Text>

            <Text style={labelStyle}>Phone</Text>
            <Text style={valueStyle}>{phone}</Text>

            <Text style={labelStyle}>Event Date</Text>
            <Text style={valueStyle}>{eventDate}</Text>

            <Text style={labelStyle}>Guest Count</Text>
            <Text style={valueStyle}>{guestCount}</Text>

            {message && (
              <>
                <Text style={labelStyle}>Message</Text>
                <Text style={valueStyle}>{message}</Text>
              </>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = {
  backgroundColor: "#FAF9F6",
  fontFamily: "'DM Sans', sans-serif",
};

const containerStyle = {
  margin: "0 auto",
  padding: "32px 24px",
  maxWidth: "560px",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "700" as const,
  color: "#1E3A8A",
  margin: "0 0 16px",
};

const hrStyle = {
  borderColor: "#E5E2DD",
  margin: "16px 0",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: "600" as const,
  color: "#78716C",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "16px 0 4px",
};

const valueStyle = {
  fontSize: "16px",
  color: "#1C1917",
  margin: "0",
};
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors.

**Step 3: Commit**

```bash
git add src/emails/CateringInquiry.tsx
git commit -m "feat: add catering inquiry email template"
```

---

### Task 3: Create the server action with honeypot + rate limiting

**Files:**
- Create: `src/actions/sendCateringInquiry.ts`

**Step 1: Build the server action**

Create `src/actions/sendCateringInquiry.ts`:

```ts
"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import CateringInquiryEmail from "@/emails/CateringInquiry";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Rate limiting (in-memory, resets on cold start) ──
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];

  // Remove expired entries
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT_MAX) {
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

// Periodically clean up stale entries (every 100 calls)
let callCount = 0;
function maybeCleanup() {
  callCount++;
  if (callCount % 100 !== 0) return;
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, recent);
    }
  }
}

// ── Validation ──
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  message: string;
  website: string; // honeypot
}

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function sendCateringInquiry(
  data: InquiryFormData,
): Promise<ActionResult> {
  // Honeypot check — silently "succeed" if bot filled it
  if (data.website) {
    return { success: true };
  }

  // Rate limiting
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  maybeCleanup();

  if (isRateLimited(ip)) {
    return {
      success: false,
      error: "Too many submissions. Please try again later.",
    };
  }

  // Server-side validation
  if (!data.name.trim()) {
    return { success: false, error: "Name is required." };
  }
  if (!data.email.trim() || !EMAIL_REGEX.test(data.email.trim())) {
    return { success: false, error: "A valid email is required." };
  }
  if (!data.phone.trim()) {
    return { success: false, error: "Phone number is required." };
  }
  if (!data.eventDate.trim()) {
    return { success: false, error: "Event date is required." };
  }
  if (!data.guestCount.trim()) {
    return { success: false, error: "Guest count is required." };
  }

  // Send email
  const siteEmail = process.env.SITE_CONTACT_EMAIL || "hello@aristos.com";

  const { error } = await resend.emails.send({
    from: "Aristos Website <onboarding@resend.dev>",
    to: siteEmail,
    subject: `Catering Inquiry from ${data.name.trim()}`,
    react: CateringInquiryEmail({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      eventDate: data.eventDate.trim(),
      guestCount: data.guestCount.trim(),
      message: data.message.trim() || undefined,
    }),
  });

  if (error) {
    console.error("Resend error:", error);
    return {
      success: false,
      error: "Failed to send your inquiry. Please try again.",
    };
  }

  return { success: true };
}
```

**Note on `from` address:** Uses Resend's shared `onboarding@resend.dev` domain which works without domain verification during development. In production (Phase 9), this gets updated to a verified domain.

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors.

**Step 3: Commit**

```bash
git add src/actions/sendCateringInquiry.ts
git commit -m "feat: add catering inquiry server action with honeypot and rate limiting"
```

---

### Task 4: Wire InquiryForm to the server action

**Files:**
- Modify: `src/components/catering/InquiryForm.tsx`

**Step 1: Update the form component**

Replace the existing `handleSubmit` logic and add loading/error state. Key changes:

1. Import `sendCateringInquiry` from `@/actions/sendCateringInquiry`
2. Add `submitting` state (boolean) and `serverError` state (string | null)
3. Replace the mock submission in `handleSubmit` with `await sendCateringInquiry(formData)`
4. Show a loading spinner on the submit button while submitting
5. Display server errors (rate limiting, email failures) above the button
6. Make `handleSubmit` async

The full updated component:

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import Button from "@/components/shared/Button";
import { sendCateringInquiry } from "@/actions/sendCateringInquiry";

interface FormData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  message: string;
  website: string; // honeypot
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  eventDate?: string;
  guestCount?: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  eventDate: "",
  guestCount: "",
  message: "",
  website: "",
};

const inputStyles =
  "bg-muted border-[1.5px] border-border rounded-md py-3 px-4 text-base font-body w-full placeholder:text-secondary transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/10 focus:outline-none";

const errorInputStyles = "border-destructive";

const labelStyles = "block text-sm font-medium text-foreground mb-1.5";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InquiryForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when the user starts typing
    if (name in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormErrors];
        return next;
      });
    }

    // Clear server error when user makes changes
    if (serverError) {
      setServerError(null);
    }
  }

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

    if (!formData.eventDate.trim()) {
      newErrors.eventDate = "Event date is required.";
    }

    if (!formData.guestCount.trim()) {
      newErrors.guestCount = "Guest count is required.";
    }

    return newErrors;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Honeypot check — if filled in, silently "succeed"
    if (formData.website) {
      setSubmitted(true);
      return;
    }

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const result = await sendCateringInquiry(formData);

    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setServerError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="bg-[#ECFDF5] border border-[#065F46]/20 rounded-md p-4 text-[#065F46] text-sm">
        Thank you for your inquiry. We&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Row 1: Name, Email */}
        <div>
          <label htmlFor="inquiry-name" className={labelStyles}>
            Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="inquiry-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            disabled={submitting}
            className={`${inputStyles} ${errors.name ? errorInputStyles : ""}`}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="inquiry-email" className={labelStyles}>
            Email <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            id="inquiry-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            disabled={submitting}
            className={`${inputStyles} ${errors.email ? errorInputStyles : ""}`}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        {/* Row 2: Phone, Event Date */}
        <div>
          <label htmlFor="inquiry-phone" className={labelStyles}>
            Phone <span className="text-destructive">*</span>
          </label>
          <input
            type="tel"
            id="inquiry-phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            disabled={submitting}
            className={`${inputStyles} ${errors.phone ? errorInputStyles : ""}`}
          />
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="inquiry-eventDate" className={labelStyles}>
            Event Date <span className="text-destructive">*</span>
          </label>
          <input
            type="date"
            id="inquiry-eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            disabled={submitting}
            className={`${inputStyles} ${errors.eventDate ? errorInputStyles : ""}`}
          />
          {errors.eventDate && (
            <p className="text-sm text-destructive mt-1">{errors.eventDate}</p>
          )}
        </div>

        {/* Row 3: Guest Count */}
        <div>
          <label htmlFor="inquiry-guestCount" className={labelStyles}>
            Guest Count <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            id="inquiry-guestCount"
            name="guestCount"
            value={formData.guestCount}
            onChange={handleChange}
            placeholder="Number of guests"
            min={1}
            disabled={submitting}
            className={`${inputStyles} ${errors.guestCount ? errorInputStyles : ""}`}
          />
          {errors.guestCount && (
            <p className="text-sm text-destructive mt-1">
              {errors.guestCount}
            </p>
          )}
        </div>

        {/* Message — full width within the grid */}
        <div className="md:col-span-2">
          <label htmlFor="inquiry-message" className={labelStyles}>
            Message
          </label>
          <textarea
            id="inquiry-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us about your event..."
            disabled={submitting}
            className={inputStyles}
          />
        </div>
      </div>

      {/* Honeypot field — hidden from real users */}
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={handleChange}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {serverError && (
        <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-md p-3 text-destructive text-sm">
          {serverError}
        </div>
      )}

      <div className="mt-6">
        <Button variant="primary" size="lg" type="submit" disabled={submitting}>
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending...
            </span>
          ) : (
            "Send Inquiry"
          )}
        </Button>
      </div>
    </form>
  );
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors.

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/components/catering/InquiryForm.tsx
git commit -m "feat: wire catering inquiry form to server action"
```

---

### Task 5: Create the Sanity revalidation webhook route

**Files:**
- Create: `src/app/api/revalidate/route.ts`

**Step 1: Build the webhook handler**

Create `src/app/api/revalidate/route.ts`:

```ts
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

const TAG_MAP: Record<string, string[]> = {
  siteSettings: ["siteSettings"],
  menuItem: ["menuItem"],
  menuCategory: ["menuCategory"],
  location: ["location"],
  cateringPackage: ["cateringPackage"],
  jobListing: ["jobListing"],
  pageContent: ["pageContent"],
};

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type: string;
    }>(req, process.env.SANITY_REVALIDATE_SECRET);

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 },
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: "Bad request" },
        { status: 400 },
      );
    }

    const tags = TAG_MAP[body._type];

    if (!tags) {
      return NextResponse.json({
        message: `No tags mapped for type "${body._type}"`,
        revalidated: false,
      });
    }

    for (const tag of tags) {
      revalidateTag(tag);
    }

    return NextResponse.json({
      revalidated: true,
      tags,
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
```

**Important:** This uses `parseBody` from `next-sanity/webhook` which handles Sanity's webhook signature verification. Check that this export exists in the installed version of `next-sanity` — if it doesn't, fall back to manual HMAC verification (see fallback below).

**Fallback if `next-sanity/webhook` doesn't export `parseBody`:**

Replace the import and signature check with:

```ts
import crypto from "crypto";

// Inside POST handler:
const signature = req.headers.get("sanity-webhook-signature");
const body = await req.json();
const secret = process.env.SANITY_REVALIDATE_SECRET;

if (secret && signature) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(JSON.stringify(body));
  const digest = hmac.digest("hex");
  if (signature !== digest) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }
} else if (secret) {
  return NextResponse.json({ message: "Missing signature" }, { status: 401 });
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors.

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/app/api/revalidate/route.ts
git commit -m "feat: add Sanity revalidation webhook route"
```

---

### Task 6: Create the dynamic sitemap

**Files:**
- Create: `src/app/sitemap.ts`

**Step 1: Build the sitemap**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery } from "@/sanity/lib/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await sanityFetch<{
    enableCatering?: boolean;
    enableCareers?: boolean;
    enableAllergens?: boolean;
  }>({ query: siteSettingsQuery, tags: ["siteSettings"] });

  const routes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/menu`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/locations`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  if (settings?.enableCatering) {
    routes.push({
      url: `${siteUrl}/catering`,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  if (settings?.enableCareers) {
    routes.push({
      url: `${siteUrl}/careers`,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  if (settings?.enableAllergens) {
    routes.push({
      url: `${siteUrl}/allergens`,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return routes;
}
```

**Step 2: Verify**

Run: `npm run build`
Expected: Build succeeds. Sitemap is generated at `/sitemap.xml`.

**Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat: add dynamic sitemap with page toggle support"
```

---

### Task 7: Add dynamic homepage metadata with OG image

**Files:**
- Modify: `src/app/(site)/page.tsx`

**Step 1: Add generateMetadata**

Add a `generateMetadata` export to the homepage. Add this import and function before the existing `HomePage` component:

```ts
import type { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";
```

Add the metadata function (before `HomePage`):

```ts
export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<any>({
    query: siteSettingsQuery,
    tags: ["siteSettings"],
  });

  const title = settings?.seoTitle || "Aristos Greek Restaurant";
  const description =
    settings?.seoDescription || "Authentic Greek cuisine made fresh daily.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(settings?.seoImage && {
        images: [{ url: urlFor(settings.seoImage).width(1200).height(630).url() }],
      }),
    },
  };
}
```

**Note:** The `title` returned here is used as-is (not templated) since it's the homepage. Next.js uses `title.default` from the root layout only when no page-level title is set. By setting `title` directly, the homepage gets exactly `"Aristos Greek Restaurant"` without the ` | Aristos Greek Restaurant` suffix.

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors.

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/app/(site)/page.tsx
git commit -m "feat: add dynamic homepage metadata with OG image from Sanity"
```

---

### Task 8: Render JsonLd in the site layout

The `JsonLd` component exists at `src/components/seo/JsonLd.tsx` but is not rendered anywhere. It should be in the site layout so structured data appears on every public page.

**Files:**
- Modify: `src/app/(site)/layout.tsx`

**Step 1: Add JsonLd to the site layout**

Import the component and render it after Footer. Pass data from the already-fetched `settings` and `primaryLocation`:

Add import:

```ts
import JsonLd from "@/components/seo/JsonLd";
import { urlFor } from "@/sanity/lib/image";
```

Add `<JsonLd>` after `<Footer>`:

```tsx
<JsonLd
  name={settings?.name ?? "Aristos Greek Restaurant"}
  description={settings?.tagline}
  phone={settings?.phone}
  address={primaryLocation?.address}
  url={process.env.NEXT_PUBLIC_SITE_URL}
  image={settings?.heroImage ? urlFor(settings.heroImage).width(1200).height(630).url() : undefined}
/>
```

**Step 2: Verify**

Run: `npm run build`
Expected: Build succeeds.

Run: `npm run dev` — visit `http://localhost:3000`, view page source, and confirm a `<script type="application/ld+json">` tag is present with Restaurant schema data.

**Step 3: Commit**

```bash
git add src/app/(site)/layout.tsx
git commit -m "feat: render JSON-LD structured data in site layout"
```

---

### Task 9: Final verification

Run the full verification suite:

**Step 1: Lint**

Run: `npm run lint`
Expected: No errors.

**Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: No type errors.

**Step 3: Build**

Run: `npm run build`
Expected: Clean build with no errors. Sitemap route and revalidation API route are listed.

**Step 4: Manual smoke test**

Run: `npm run dev` and verify:

1. Visit `/catering` — form renders, submit with all fields filled, check for loading state and success message
2. Visit `/sitemap.xml` — XML renders with all expected routes
3. View page source on `/` — JSON-LD `<script>` is present
4. View page source on `/` — `<meta>` tags for OG title/description are present

**Step 5: Commit any fixes**

If any issues were found in steps 1-4, fix and commit.

---

## Summary of deliverables

| # | Deliverable | File(s) |
|---|-------------|---------|
| 1 | Env variable | `.env.example` |
| 2 | Email template | `src/emails/CateringInquiry.tsx` |
| 3 | Server action (honeypot + rate limit) | `src/actions/sendCateringInquiry.ts` |
| 4 | Form wired to server action | `src/components/catering/InquiryForm.tsx` |
| 5 | Revalidation webhook | `src/app/api/revalidate/route.ts` |
| 6 | Dynamic sitemap | `src/app/sitemap.ts` |
| 7 | Homepage dynamic metadata + OG | `src/app/(site)/page.tsx` |
| 8 | JSON-LD in site layout | `src/app/(site)/layout.tsx` |
