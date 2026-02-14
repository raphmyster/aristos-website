import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { menuCategoriesQuery, menuItemsQuery } from "@/sanity/lib/queries";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import MenuPageClient from "@/components/menu/MenuPageClient";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse our full menu of authentic Greek dishes.",
};

export default async function MenuPage() {
  const [categories, items] = await Promise.all([
    sanityFetch<any[]>({ query: menuCategoriesQuery, tags: ["menuCategory"] }),
    sanityFetch<any[]>({ query: menuItemsQuery, tags: ["menuItem"] }),
  ]);

  return (
    <>
      <section className="bg-muted py-12 md:py-16">
        <Container className="text-center">
          <SectionHeading as="h1">Our Menu</SectionHeading>
        </Container>
      </section>

      <MenuPageClient
        categories={categories ?? []}
        items={items ?? []}
      />
    </>
  );
}
