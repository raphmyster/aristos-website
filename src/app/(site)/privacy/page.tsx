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
