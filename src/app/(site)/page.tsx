import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  siteSettingsQuery,
  featuredMenuItemsQuery,
  primaryLocationQuery,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Hero from "@/components/home/Hero";
import MenuHighlights from "@/components/home/MenuHighlights";
import OrderStrip from "@/components/layout/OrderStrip";
import LocationPreview from "@/components/home/LocationPreview";

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
