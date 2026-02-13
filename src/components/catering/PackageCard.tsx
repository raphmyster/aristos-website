import SanityImage from "@/components/shared/SanityImage";

interface PackageCardProps {
  name: string;
  description?: string;
  priceRange?: string;
  image?: any; // Sanity image
}

export default function PackageCard({
  name,
  description,
  priceRange,
  image,
}: PackageCardProps) {
  return (
    <div className="bg-white border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200">
      {/* Image area */}
      {image ? (
        <SanityImage
          image={image}
          alt={name}
          width={960}
          height={540}
          className="w-full h-auto object-cover aspect-video"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      ) : (
        <div className="aspect-video bg-muted" />
      )}

      {/* Content area */}
      <div className="p-6">
        <h3 className="font-heading text-xl md:text-2xl leading-[1.2]">
          {name}
        </h3>

        {description && (
          <p className="text-sm text-secondary mt-2">{description}</p>
        )}

        {priceRange && (
          <span className="text-lg font-medium mt-3 block">{priceRange}</span>
        )}
      </div>
    </div>
  );
}
