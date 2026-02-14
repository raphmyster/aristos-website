import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  siteSettingsQuery,
  pageContentQuery,
  menuItemsWithAllergensQuery,
} from "@/sanity/lib/queries";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import PortableTextRenderer from "@/components/shared/PortableTextRenderer";
import DietaryIcon from "@/components/menu/DietaryIcon";

export const metadata: Metadata = {
  title: "Allergens",
  description: "Allergen information for all Aristos menu items.",
};

export default async function AllergensPage() {
  const [settings, pageContent, items] = await Promise.all([
    sanityFetch<any>({ query: siteSettingsQuery, tags: ["siteSettings"] }),
    sanityFetch<any>({
      query: pageContentQuery,
      params: { slug: "allergens" },
      tags: ["pageContent"],
    }),
    sanityFetch<any[]>({
      query: menuItemsWithAllergensQuery,
      tags: ["menuItem"],
    }),
  ]);

  if (!settings?.enableAllergens) {
    notFound();
  }

  return (
    <section className="py-12 md:py-16">
      <Container className="max-w-3xl">
        <SectionHeading as="h1" className="mb-8">
          Allergen Information
        </SectionHeading>

        {pageContent?.body && (
          <PortableTextRenderer value={pageContent.body} className="mb-12" />
        )}

        {items && items.length > 0 && (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-3 text-sm font-semibold">Item</th>
                  <th className="px-4 py-3 text-sm font-semibold">Category</th>
                  <th className="px-4 py-3 text-sm font-semibold">Allergens</th>
                  <th className="px-4 py-3 text-sm font-semibold">Dietary</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-t border-border">
                    <td className="px-4 py-3 text-sm font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary">
                      {item.category?.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary">
                      {item.allergens?.join(", ")}
                    </td>
                    <td className="px-4 py-3">
                      {item.dietaryTags && item.dietaryTags.length > 0 && (
                        <div className="flex gap-1">
                          {item.dietaryTags.map((tag: string) => (
                            <DietaryIcon
                              key={tag}
                              tag={tag as "V" | "VG" | "GF"}
                            />
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </section>
  );
}
