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
