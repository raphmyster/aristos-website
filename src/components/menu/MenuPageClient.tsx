"use client";

import { useState } from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuItemCard from "@/components/menu/MenuItemCard";

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  photo?: any;
  dietaryTags?: string[];
  category?: { _id: string; name: string; slug: { current: string } };
}

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
}

interface MenuPageClientProps {
  categories: Category[];
  items: MenuItem[];
}

export default function MenuPageClient({
  categories,
  items,
}: MenuPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("");

  const filteredItems = activeCategory
    ? items.filter((item) => item.category?.slug?.current === activeCategory)
    : items;

  // Group items by category for display
  const groupedItems = activeCategory
    ? [{ category: categories.find((c) => c.slug.current === activeCategory), items: filteredItems }]
    : categories
        .map((cat) => ({
          category: cat,
          items: filteredItems.filter(
            (item) => item.category?.slug?.current === cat.slug.current
          ),
        }))
        .filter((group) => group.items.length > 0);

  return (
    <>
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <Container className="py-8 md:py-12">
        {groupedItems.map((group) => (
          <section key={group.category?._id ?? "all"} className="mb-12 last:mb-0">
            {!activeCategory && group.category && (
              <SectionHeading as="h2" className="mb-6">
                {group.category.name}
              </SectionHeading>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.items.map((item) => (
                <MenuItemCard
                  key={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  photo={item.photo}
                  dietaryTags={item.dietaryTags}
                />
              ))}
            </div>
          </section>
        ))}

        {filteredItems.length === 0 && (
          <p className="text-secondary text-center py-12">
            No menu items available.
          </p>
        )}
      </Container>
    </>
  );
}
