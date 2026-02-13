import type { Restaurant, WithContext } from "schema-dts";

interface JsonLdProps {
  name: string;
  description?: string;
  phone?: string;
  address?: string;
  url?: string;
  image?: string;
  priceRange?: string;
}

export default function JsonLd({
  name,
  description,
  phone,
  address,
  url,
  image,
  priceRange,
}: JsonLdProps) {
  const jsonLd: WithContext<Restaurant> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name,
    ...(description && { description }),
    ...(phone && { telephone: phone }),
    ...(address && {
      address: { "@type": "PostalAddress", streetAddress: address },
    }),
    ...(url && { url }),
    ...(image && { image }),
    servesCuisine: "Greek",
    priceRange: priceRange || "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
