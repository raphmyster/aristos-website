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
