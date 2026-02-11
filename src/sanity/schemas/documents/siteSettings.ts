import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "hero", title: "Hero" },
    { name: "uiText", title: "UI Text" },
    { name: "announcement", title: "Announcement Bar" },
    { name: "ordering", title: "Ordering" },
    { name: "pageToggles", title: "Page Toggles" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ── General ──
    defineField({
      name: "name",
      title: "Restaurant Name",
      type: "string",
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "general",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "general",
      options: { hotspot: true },
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      group: "general",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "general",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [{ type: "socialLink" }],
      group: "general",
    }),

    // ── Hero ──
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      group: "hero",
      description: "Main text displayed on the hero section",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "string",
      group: "hero",
      description: "Secondary text below the headline",
    }),
    defineField({
      name: "primaryCtaText",
      title: "Primary CTA Text",
      type: "string",
      group: "hero",
      description: "e.g. Order Now",
    }),
    defineField({
      name: "primaryCtaLink",
      title: "Primary CTA Link",
      type: "url",
      group: "hero",
      validation: (rule) =>
        rule.uri({ allowRelative: true, scheme: ["http", "https", "tel"] }),
    }),
    defineField({
      name: "secondaryCtaText",
      title: "Secondary CTA Text",
      type: "string",
      group: "hero",
      description: "e.g. View Menu",
    }),
    defineField({
      name: "secondaryCtaLink",
      title: "Secondary CTA Link",
      type: "string",
      group: "hero",
      description: "Relative or absolute URL, e.g. /menu",
    }),

    // ── UI Text ──
    defineField({
      name: "menuSectionHeading",
      title: "Menu Section Heading",
      type: "string",
      group: "uiText",
      description: "Homepage menu section heading, e.g. Our Menu",
    }),
    defineField({
      name: "locationSectionHeading",
      title: "Location Section Heading",
      type: "string",
      group: "uiText",
      description: "Homepage location section heading, e.g. Find Us",
    }),
    defineField({
      name: "orderButtonText",
      title: "Order Button Text",
      type: "string",
      group: "uiText",
      description: "e.g. Order Now",
    }),
    defineField({
      name: "viewMenuText",
      title: "View Menu Button Text",
      type: "string",
      group: "uiText",
      description: "e.g. View Full Menu",
    }),

    // ── Announcement Bar ──
    defineField({
      name: "announcementEnabled",
      title: "Enable Announcement Bar",
      type: "boolean",
      group: "announcement",
      initialValue: false,
    }),
    defineField({
      name: "announcementText",
      title: "Announcement Text",
      type: "string",
      group: "announcement",
      hidden: ({ document }) => !document?.announcementEnabled,
    }),
    defineField({
      name: "announcementLink",
      title: "Announcement Link",
      type: "url",
      group: "announcement",
      description: "Optional link for the announcement",
      hidden: ({ document }) => !document?.announcementEnabled,
      validation: (rule) =>
        rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
    defineField({
      name: "announcementStyle",
      title: "Announcement Style",
      type: "string",
      group: "announcement",
      options: {
        list: [
          { title: "Info", value: "info" },
          { title: "Warning", value: "warning" },
          { title: "Celebration", value: "celebration" },
        ],
        layout: "radio",
      },
      initialValue: "info",
      hidden: ({ document }) => !document?.announcementEnabled,
    }),

    // ── Ordering ──
    defineField({
      name: "deliveryApps",
      title: "Delivery Apps",
      type: "array",
      of: [{ type: "deliveryApp" }],
      group: "ordering",
    }),

    // ── Page Toggles ──
    defineField({
      name: "enableCatering",
      title: "Enable Catering Page",
      type: "boolean",
      group: "pageToggles",
      initialValue: true,
    }),
    defineField({
      name: "enableCareers",
      title: "Enable Careers Page",
      type: "boolean",
      group: "pageToggles",
      initialValue: true,
    }),
    defineField({
      name: "enableAllergens",
      title: "Enable Allergens Page",
      type: "boolean",
      group: "pageToggles",
      initialValue: true,
    }),

    // ── SEO ──
    defineField({
      name: "seoTitle",
      title: "Default SEO Title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "Default SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
    }),
    defineField({
      name: "seoImage",
      title: "Default OG Image",
      type: "image",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});
