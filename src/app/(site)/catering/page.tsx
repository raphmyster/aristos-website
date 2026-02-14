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
