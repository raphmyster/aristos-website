"use client";

import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: Array<{ _id: string; name: string; slug: { current: string } }>;
  activeCategory: string; // slug of currently selected category, "" for "All"
  onCategoryChange: (slug: string) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  const allTabs = [
    { slug: "", label: "All" },
    ...categories.map((cat) => ({ slug: cat.slug.current, label: cat.name })),
  ];

  return (
    <div className="sticky top-16 lg:top-[72px] z-40 bg-background py-3 border-b border-border -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
      {/* Wrapper with mobile fade hint */}
      <div className="relative after:absolute after:right-0 after:top-0 after:bottom-0 after:w-8 after:bg-gradient-to-l after:from-background after:to-transparent after:pointer-events-none after:lg:hidden">
        <div
          className="flex gap-2 overflow-x-auto justify-start lg:justify-center [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {allTabs.map((tab) => {
            const isActive = activeCategory === tab.slug;
            return (
              <button
                key={tab.slug}
                onClick={() => onCategoryChange(tab.slug)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-primary text-white border border-primary"
                    : "bg-transparent border border-border text-foreground hover:bg-muted"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
