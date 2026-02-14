/**
 * Sanity Content Seed Script
 *
 * Populates the Sanity dataset with placeholder content for Aristos Greek Restaurant.
 * Run: npx tsx scripts/seed.ts
 *
 * Requires environment variables:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN  (a token with write permissions)
 */

import { createClient } from "@sanity/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}
if (!token) {
  console.error(
    "Missing SANITY_API_WRITE_TOKEN — create one at https://www.sanity.io/manage",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// ── Helpers ──

function block(text: string) {
  return {
    _type: "block" as const,
    _key: crypto.randomUUID().slice(0, 8),
    style: "normal" as const,
    markDefs: [],
    children: [
      {
        _type: "span" as const,
        _key: crypto.randomUUID().slice(0, 8),
        text,
        marks: [],
      },
    ],
  };
}

function heading(text: string, level: "h2" | "h3" = "h2") {
  return {
    _type: "block" as const,
    _key: crypto.randomUUID().slice(0, 8),
    style: level,
    markDefs: [],
    children: [
      {
        _type: "span" as const,
        _key: crypto.randomUUID().slice(0, 8),
        text,
        marks: [],
      },
    ],
  };
}

function key() {
  return crypto.randomUUID().slice(0, 8);
}

// ── IDs (fixed so script is idempotent with createOrReplace) ──

const IDS = {
  settings: "siteSettings",
  // Categories
  catWraps: "cat-wraps",
  catBowls: "cat-bowls",
  catSalads: "cat-salads",
  catSides: "cat-sides",
  catDesserts: "cat-desserts",
  // Location
  locationMain: "loc-main",
  // Catering
  cateringBasic: "catering-basic",
  cateringClassic: "catering-classic",
  cateringPremium: "catering-premium",
  // Pages
  pagePrivacy: "page-privacy",
  pageTerms: "page-terms",
  pageAllergens: "page-allergens",
  // Jobs
  jobCrew: "job-crew-member",
  jobShift: "job-shift-lead",
};

// ── Site Settings ──

const siteSettings = {
  _id: IDS.settings,
  _type: "siteSettings",
  name: "Aristos",
  tagline: "Authentic Greek. Made Fresh Daily.",
  phone: "(555) 867-5309",
  email: "hello@aristosgreek.com",
  heroHeadline: "Fresh Greek Flavors, Every Day",
  heroSubheadline:
    "Handcrafted wraps, bowls, and salads made with authentic recipes and the freshest ingredients.",
  primaryCtaText: "Order Now",
  primaryCtaLink: "#order",
  secondaryCtaText: "View Menu",
  secondaryCtaLink: "/menu",
  menuSectionHeading: "What's Good",
  locationSectionHeading: "Find Us",
  orderButtonText: "Order Now",
  viewMenuText: "View Full Menu",
  announcementEnabled: true,
  announcementText: "Now open for catering! Book your next event with us.",
  announcementLink: "/catering",
  announcementStyle: "celebration",
  deliveryApps: [
    { _type: "deliveryApp", _key: key(), name: "Uber Eats", url: "https://ubereats.com" },
    { _type: "deliveryApp", _key: key(), name: "DoorDash", url: "https://doordash.com" },
    { _type: "deliveryApp", _key: key(), name: "Grubhub", url: "https://grubhub.com" },
  ],
  socialLinks: [
    { _type: "socialLink", _key: key(), platform: "Instagram", url: "https://instagram.com/aristosgreek" },
    { _type: "socialLink", _key: key(), platform: "Facebook", url: "https://facebook.com/aristosgreek" },
    { _type: "socialLink", _key: key(), platform: "Yelp", url: "https://yelp.com/biz/aristos-greek" },
  ],
  enableCatering: true,
  enableCareers: true,
  enableAllergens: true,
  seoTitle: "Aristos Greek Restaurant",
  seoDescription:
    "Fresh Greek wraps, bowls, and salads made daily with authentic recipes. Order online or visit us today.",
};

// ── Menu Categories ──

const menuCategories = [
  {
    _id: IDS.catWraps,
    _type: "menuCategory",
    name: "Wraps",
    slug: { _type: "slug", current: "wraps" },
    sortOrder: 1,
    description: "Hand-rolled in warm pita with fresh toppings and house-made sauces.",
  },
  {
    _id: IDS.catBowls,
    _type: "menuCategory",
    name: "Bowls",
    slug: { _type: "slug", current: "bowls" },
    sortOrder: 2,
    description: "Hearty bowls over seasoned rice with your choice of protein.",
  },
  {
    _id: IDS.catSalads,
    _type: "menuCategory",
    name: "Salads",
    slug: { _type: "slug", current: "salads" },
    sortOrder: 3,
    description: "Crisp greens and bold Mediterranean flavors.",
  },
  {
    _id: IDS.catSides,
    _type: "menuCategory",
    name: "Sides",
    slug: { _type: "slug", current: "sides" },
    sortOrder: 4,
    description: "Perfect additions to any meal.",
  },
  {
    _id: IDS.catDesserts,
    _type: "menuCategory",
    name: "Desserts",
    slug: { _type: "slug", current: "desserts" },
    sortOrder: 5,
    description: "Sweet endings with a Greek twist.",
  },
];

// ── Menu Items ──

const menuItems = [
  // Wraps
  {
    _id: "item-chicken-souvlaki-wrap",
    _type: "menuItem",
    name: "Chicken Souvlaki Wrap",
    slug: { _type: "slug", current: "chicken-souvlaki-wrap" },
    description:
      "Marinated chicken skewer, tomatoes, onions, and tzatziki sauce wrapped in warm pita.",
    price: 11.99,
    category: { _type: "reference", _ref: IDS.catWraps },
    dietaryTags: [],
    allergens: ["Wheat", "Milk"],
    isFeatured: true,
    isAvailable: true,
  },
  {
    _id: "item-pork-souvlaki-wrap",
    _type: "menuItem",
    name: "Pork Souvlaki Wrap",
    slug: { _type: "slug", current: "pork-souvlaki-wrap" },
    description:
      "Tender pork skewer with tomatoes, onions, and tzatziki in warm pita.",
    price: 11.99,
    category: { _type: "reference", _ref: IDS.catWraps },
    dietaryTags: [],
    allergens: ["Wheat", "Milk"],
    isFeatured: false,
    isAvailable: true,
  },
  {
    _id: "item-gyro-wrap",
    _type: "menuItem",
    name: "Classic Gyro",
    slug: { _type: "slug", current: "classic-gyro" },
    description:
      "Slow-roasted beef and lamb gyro meat with tomatoes, onions, and tzatziki.",
    price: 12.99,
    category: { _type: "reference", _ref: IDS.catWraps },
    dietaryTags: [],
    allergens: ["Wheat", "Milk"],
    isFeatured: true,
    isAvailable: true,
  },
  {
    _id: "item-falafel-wrap",
    _type: "menuItem",
    name: "Falafel Wrap",
    slug: { _type: "slug", current: "falafel-wrap" },
    description:
      "Crispy house-made falafel with hummus, pickled turnips, tomatoes, and tahini.",
    price: 10.99,
    category: { _type: "reference", _ref: IDS.catWraps },
    dietaryTags: ["VG"],
    allergens: ["Wheat", "Sesame"],
    isFeatured: false,
    isAvailable: true,
  },
  {
    _id: "item-shrimp-wrap",
    _type: "menuItem",
    name: "Grilled Shrimp Wrap",
    slug: { _type: "slug", current: "grilled-shrimp-wrap" },
    description:
      "Seasoned grilled shrimp with mixed greens, feta, and lemon herb dressing.",
    price: 13.99,
    category: { _type: "reference", _ref: IDS.catWraps },
    dietaryTags: [],
    allergens: ["Wheat", "Shellfish", "Milk"],
    isFeatured: false,
    isAvailable: true,
  },
  {
    _id: "item-steak-wrap",
    _type: "menuItem",
    name: "Steak Wrap",
    slug: { _type: "slug", current: "steak-wrap" },
    description:
      "Grilled sirloin steak with caramelized onions, peppers, and garlic aioli.",
    price: 14.99,
    category: { _type: "reference", _ref: IDS.catWraps },
    dietaryTags: [],
    allergens: ["Wheat", "Eggs"],
    isFeatured: false,
    isAvailable: true,
  },
  // Bowls
  {
    _id: "item-chicken-bowl",
    _type: "menuItem",
    name: "Chicken Souvlaki Bowl",
    slug: { _type: "slug", current: "chicken-souvlaki-bowl" },
    description:
      "Marinated chicken over seasoned rice with tomatoes, cucumbers, red onion, and tzatziki.",
    price: 13.99,
    category: { _type: "reference", _ref: IDS.catBowls },
    dietaryTags: ["GF"],
    allergens: ["Milk"],
    isFeatured: true,
    isAvailable: true,
  },
  {
    _id: "item-gyro-bowl",
    _type: "menuItem",
    name: "Gyro Bowl",
    slug: { _type: "slug", current: "gyro-bowl" },
    description:
      "Sliced gyro meat over rice with hummus, tomatoes, onions, and hot sauce.",
    price: 14.99,
    category: { _type: "reference", _ref: IDS.catBowls },
    dietaryTags: ["GF"],
    allergens: ["Milk", "Sesame"],
    isFeatured: false,
    isAvailable: true,
  },
  {
    _id: "item-falafel-bowl",
    _type: "menuItem",
    name: "Falafel Bowl",
    slug: { _type: "slug", current: "falafel-bowl" },
    description:
      "Crispy falafel over rice with hummus, tabbouleh, pickled turnips, and tahini.",
    price: 12.99,
    category: { _type: "reference", _ref: IDS.catBowls },
    dietaryTags: ["VG", "GF"],
    allergens: ["Sesame"],
    isFeatured: false,
    isAvailable: true,
  },
  // Salads
  {
    _id: "item-greek-salad",
    _type: "menuItem",
    name: "Classic Greek Salad",
    slug: { _type: "slug", current: "classic-greek-salad" },
    description:
      "Romaine, tomatoes, cucumbers, red onion, Kalamata olives, and feta with Greek vinaigrette.",
    price: 10.99,
    category: { _type: "reference", _ref: IDS.catSalads },
    dietaryTags: ["V", "GF"],
    allergens: ["Milk"],
    isFeatured: true,
    isAvailable: true,
  },
  {
    _id: "item-chicken-salad",
    _type: "menuItem",
    name: "Grilled Chicken Salad",
    slug: { _type: "slug", current: "grilled-chicken-salad" },
    description:
      "Grilled chicken breast over mixed greens with tomatoes, cucumbers, feta, and balsamic.",
    price: 13.99,
    category: { _type: "reference", _ref: IDS.catSalads },
    dietaryTags: ["GF"],
    allergens: ["Milk"],
    isFeatured: false,
    isAvailable: true,
  },
  // Sides
  {
    _id: "item-hummus",
    _type: "menuItem",
    name: "Hummus & Pita",
    slug: { _type: "slug", current: "hummus-pita" },
    description: "Creamy house-made hummus served with warm pita wedges.",
    price: 6.99,
    category: { _type: "reference", _ref: IDS.catSides },
    dietaryTags: ["VG"],
    allergens: ["Wheat", "Sesame"],
    isFeatured: false,
    isAvailable: true,
  },
  {
    _id: "item-calamari",
    _type: "menuItem",
    name: "Crispy Calamari",
    slug: { _type: "slug", current: "crispy-calamari" },
    description: "Lightly breaded and fried, served with marinara and lemon.",
    price: 9.99,
    category: { _type: "reference", _ref: IDS.catSides },
    dietaryTags: [],
    allergens: ["Wheat", "Shellfish", "Eggs"],
    isFeatured: false,
    isAvailable: true,
  },
  {
    _id: "item-fries",
    _type: "menuItem",
    name: "Greek Fries",
    slug: { _type: "slug", current: "greek-fries" },
    description:
      "Crispy fries tossed with oregano, feta crumbles, and a squeeze of lemon.",
    price: 5.99,
    category: { _type: "reference", _ref: IDS.catSides },
    dietaryTags: ["V", "GF"],
    allergens: ["Milk"],
    isFeatured: false,
    isAvailable: true,
  },
  {
    _id: "item-spanakopita",
    _type: "menuItem",
    name: "Spanakopita",
    slug: { _type: "slug", current: "spanakopita" },
    description: "Flaky phyllo filled with spinach and feta cheese.",
    price: 7.99,
    category: { _type: "reference", _ref: IDS.catSides },
    dietaryTags: ["V"],
    allergens: ["Wheat", "Milk", "Eggs"],
    isFeatured: false,
    isAvailable: true,
  },
  // Desserts
  {
    _id: "item-baklava",
    _type: "menuItem",
    name: "Baklava",
    slug: { _type: "slug", current: "baklava" },
    description:
      "Layers of phyllo dough, walnuts, and honey syrup. Two pieces per order.",
    price: 5.99,
    category: { _type: "reference", _ref: IDS.catDesserts },
    dietaryTags: ["V"],
    allergens: ["Wheat", "Tree Nuts"],
    isFeatured: false,
    isAvailable: true,
  },
  {
    _id: "item-loukoumades",
    _type: "menuItem",
    name: "Loukoumades",
    slug: { _type: "slug", current: "loukoumades" },
    description: "Golden Greek doughnut bites drizzled with honey and cinnamon.",
    price: 6.99,
    category: { _type: "reference", _ref: IDS.catDesserts },
    dietaryTags: ["V"],
    allergens: ["Wheat", "Eggs", "Milk"],
    isFeatured: false,
    isAvailable: true,
  },
];

// ── Location ──

const location = {
  _id: IDS.locationMain,
  _type: "location",
  name: "Downtown",
  address: "123 Mediterranean Ave\nAnytown, USA 12345",
  phone: "(555) 867-5309",
  googleMapsLink: "https://maps.google.com",
  isPrimary: true,
  sortOrder: 0,
  hours: [
    { _type: "dayHours", _key: key(), day: "Monday", openTime: "11:00 AM", closeTime: "9:00 PM", isClosed: false },
    { _type: "dayHours", _key: key(), day: "Tuesday", openTime: "11:00 AM", closeTime: "9:00 PM", isClosed: false },
    { _type: "dayHours", _key: key(), day: "Wednesday", openTime: "11:00 AM", closeTime: "9:00 PM", isClosed: false },
    { _type: "dayHours", _key: key(), day: "Thursday", openTime: "11:00 AM", closeTime: "9:00 PM", isClosed: false },
    { _type: "dayHours", _key: key(), day: "Friday", openTime: "11:00 AM", closeTime: "10:00 PM", isClosed: false },
    { _type: "dayHours", _key: key(), day: "Saturday", openTime: "11:00 AM", closeTime: "10:00 PM", isClosed: false },
    { _type: "dayHours", _key: key(), day: "Sunday", openTime: "12:00 PM", closeTime: "8:00 PM", isClosed: false },
  ],
};

// ── Catering Packages ──

const cateringPackages = [
  {
    _id: IDS.cateringBasic,
    _type: "cateringPackage",
    name: "The Mezze",
    description:
      "A selection of dips, pita, and light bites. Perfect for office meetings and small gatherings.",
    priceRange: "$10-12 per person",
    sortOrder: 1,
  },
  {
    _id: IDS.cateringClassic,
    _type: "cateringPackage",
    name: "The Olympian",
    description:
      "Our most popular package. Choose 2 proteins, 2 sides, salad, pita, and sauces. Feeds any crowd.",
    priceRange: "$16-20 per person",
    sortOrder: 2,
  },
  {
    _id: IDS.cateringPremium,
    _type: "cateringPackage",
    name: "The Full Spread",
    description:
      "The complete Aristos experience. All proteins, all sides, Greek salad, dessert, and drinks included.",
    priceRange: "$25-30 per person",
    sortOrder: 3,
  },
];

// ── Page Content ──

const pages = [
  {
    _id: IDS.pagePrivacy,
    _type: "pageContent",
    title: "Privacy Policy",
    slug: { _type: "slug", current: "privacy" },
    body: [
      heading("Privacy Policy"),
      block(
        "Last updated: February 2026. This Privacy Policy describes how Aristos Greek Restaurant collects, uses, and shares information when you visit our website.",
      ),
      heading("Information We Collect", "h3"),
      block(
        "We collect information you provide directly, such as when you submit our catering inquiry form (name, email, phone number, event details). We also automatically collect certain information when you visit our website, including your IP address, browser type, and pages visited.",
      ),
      heading("How We Use Your Information", "h3"),
      block(
        "We use the information we collect to respond to your catering inquiries, improve our website and services, and communicate with you about your orders or events.",
      ),
      heading("Information Sharing", "h3"),
      block(
        "We do not sell your personal information. We may share your information with service providers who help us operate our website (such as our email provider) or as required by law.",
      ),
      heading("Cookies", "h3"),
      block(
        "Our website uses minimal cookies for basic functionality. We use privacy-friendly analytics that do not require cookie consent.",
      ),
      heading("Contact Us", "h3"),
      block(
        "If you have questions about this Privacy Policy, please contact us at hello@aristosgreek.com or call (555) 867-5309.",
      ),
    ],
  },
  {
    _id: IDS.pageTerms,
    _type: "pageContent",
    title: "Terms of Service",
    slug: { _type: "slug", current: "terms" },
    body: [
      heading("Terms of Service"),
      block(
        "Last updated: February 2026. By using the Aristos Greek Restaurant website, you agree to these Terms of Service.",
      ),
      heading("Use of Website", "h3"),
      block(
        "This website is provided for informational purposes and to facilitate catering inquiries. Menu items, prices, and availability are subject to change without notice.",
      ),
      heading("Catering Inquiries", "h3"),
      block(
        "Submitting a catering inquiry form does not constitute a confirmed order. Our team will contact you to discuss details and confirm your event. Final pricing may vary based on specific requirements.",
      ),
      heading("Intellectual Property", "h3"),
      block(
        "All content on this website, including text, images, logos, and design, is the property of Aristos Greek Restaurant and may not be reproduced without permission.",
      ),
      heading("Limitation of Liability", "h3"),
      block(
        "Aristos Greek Restaurant is not liable for any damages arising from the use of this website. Menu information is provided as a general guide and may not reflect real-time availability.",
      ),
      heading("Contact", "h3"),
      block(
        "For questions about these terms, contact us at hello@aristosgreek.com.",
      ),
    ],
  },
  {
    _id: IDS.pageAllergens,
    _type: "pageContent",
    title: "Allergen Information",
    slug: { _type: "slug", current: "allergens" },
    body: [
      heading("Allergen Information"),
      block(
        "At Aristos, we take food allergies seriously. Below you will find allergen information for all of our menu items. Please note that our kitchen handles multiple allergens and cross-contamination is possible.",
      ),
      block(
        "If you have a severe allergy, please inform our staff before ordering so we can take extra precautions. Our team is happy to answer any questions about ingredients in our dishes.",
      ),
      block(
        "Allergen data is provided as a guide. Ingredients and preparation methods may change. Always confirm with our staff for the most current information.",
      ),
    ],
  },
];

// ── Job Listings ──

const jobListings = [
  {
    _id: IDS.jobCrew,
    _type: "jobListing",
    title: "Crew Member",
    description: [
      block(
        "Join the Aristos team! We are looking for energetic, friendly crew members to help us serve the best Greek food in town.",
      ),
      heading("Responsibilities", "h3"),
      block(
        "Prepare food to Aristos quality standards. Provide outstanding customer service. Maintain a clean and organized work environment. Work as part of a fast-paced team.",
      ),
      heading("Qualifications", "h3"),
      block(
        "No experience necessary — we will train you! Must be reliable, positive, and eager to learn. Ability to work on your feet in a fast-paced environment. Must be at least 16 years old.",
      ),
      heading("What We Offer", "h3"),
      block(
        "Competitive pay. Flexible scheduling. Free meals during shifts. A fun, supportive team environment.",
      ),
    ],
    location: "Downtown",
    type: "part-time",
    applyEmail: "jobs@aristosgreek.com",
    isActive: true,
    postedDate: "2026-02-01",
  },
  {
    _id: IDS.jobShift,
    _type: "jobListing",
    title: "Shift Lead",
    description: [
      block(
        "We are looking for an experienced shift lead to help manage daily operations and lead our crew during peak hours.",
      ),
      heading("Responsibilities", "h3"),
      block(
        "Oversee daily shift operations. Train and mentor crew members. Ensure food quality and safety standards. Handle customer concerns. Manage cash handling and closing procedures.",
      ),
      heading("Qualifications", "h3"),
      block(
        "1+ year of food service experience preferred. Leadership or supervisory experience a plus. Strong communication and problem-solving skills. Must be at least 18 years old.",
      ),
      heading("What We Offer", "h3"),
      block(
        "Competitive hourly pay plus tips. Health benefits for full-time employees. Growth opportunities within Aristos. Free meals during shifts.",
      ),
    ],
    location: "Downtown",
    type: "full-time",
    applyEmail: "jobs@aristosgreek.com",
    isActive: true,
    postedDate: "2026-02-10",
  },
];

// ── Seed Runner ──

async function seed() {
  console.log(`Seeding dataset "${dataset}" in project "${projectId}"...\n`);

  const allDocs: Record<string, unknown>[] = [
    siteSettings,
    ...menuCategories,
    ...menuItems,
    location,
    ...cateringPackages,
    ...pages,
    ...jobListings,
  ];

  let created = 0;
  for (const doc of allDocs) {
    try {
      await client.createOrReplace(doc as any);
      console.log(`  ✓ ${doc._type}: ${doc.name || doc.title}`);
      created++;
    } catch (err: any) {
      console.error(
        `  ✗ ${doc._type}: ${doc.name || doc.title} — ${err.message}`,
      );
    }
  }

  console.log(`\nDone! ${created}/${allDocs.length} documents created.\n`);
  console.log("Next steps:");
  console.log("  1. Open /studio to verify content");
  console.log("  2. Upload images via Sanity Studio (hero, menu items, logo)");
  console.log("  3. Update delivery app URLs with real links");
  console.log("  4. Update location address and Google Maps links");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
