import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery, primaryLocationQuery } from "@/sanity/lib/queries";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { urlFor } from "@/sanity/lib/image";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, primaryLocation] = await Promise.all([
    sanityFetch<any>({ query: siteSettingsQuery, tags: ["siteSettings"] }),
    sanityFetch<any>({ query: primaryLocationQuery, tags: ["location"] }),
  ]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to content
      </a>
      <AnnouncementBar
        enabled={settings?.announcementEnabled ?? false}
        text={settings?.announcementText ?? ""}
        link={settings?.announcementLink}
        style={settings?.announcementStyle ?? "info"}
      />
      <Navbar
        logo={settings?.logo}
        siteName={settings?.name}
        orderButtonText={settings?.orderButtonText}
        primaryCtaLink={settings?.primaryCtaLink}
        enableCatering={settings?.enableCatering}
      />
      <main id="main-content">{children}</main>
      <Footer
        name={settings?.name ?? "Aristos"}
        tagline={settings?.tagline}
        logo={settings?.logo}
        phone={settings?.phone}
        email={settings?.email}
        socialLinks={settings?.socialLinks}
        enableCatering={settings?.enableCatering}
        enableCareers={settings?.enableCareers}
        enableAllergens={settings?.enableAllergens}
        primaryLocation={primaryLocation}
      />
      <JsonLd
        name={settings?.name ?? "Aristos Greek Restaurant"}
        description={settings?.tagline}
        phone={settings?.phone}
        address={primaryLocation?.address}
        url={process.env.NEXT_PUBLIC_SITE_URL}
        image={settings?.heroImage ? urlFor(settings.heroImage).width(1200).height(630).url() : undefined}
      />
    </>
  );
}
