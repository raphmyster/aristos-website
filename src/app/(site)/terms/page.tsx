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
