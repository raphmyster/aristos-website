import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { locationsQuery } from "@/sanity/lib/queries";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import LocationCard from "@/components/locations/LocationCard";

export const metadata: Metadata = {
  title: "Locations",
  description: "Find an Aristos location near you. Hours, directions, and contact info.",
};

export default async function LocationsPage() {
  const locations = await sanityFetch<any[]>({
    query: locationsQuery,
    tags: ["location"],
  });

  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionHeading as="h1" className="mb-8">
          Our Locations
        </SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(locations ?? []).map((loc) => (
            <LocationCard
              key={loc._id}
              name={loc.name}
              address={loc.address}
              phone={loc.phone}
              googleMapsEmbed={loc.googleMapsEmbed}
              googleMapsLink={loc.googleMapsLink}
              hours={loc.hours}
              isPrimary={loc.isPrimary}
            />
          ))}
        </div>

        {(!locations || locations.length === 0) && (
          <p className="text-secondary text-center py-12">
            Location information coming soon.
          </p>
        )}
      </Container>
    </section>
  );
}
