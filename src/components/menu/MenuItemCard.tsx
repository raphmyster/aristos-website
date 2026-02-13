import SanityImage from "@/components/shared/SanityImage";
import { cn, formatPrice } from "@/lib/utils";
import DietaryIcon from "@/components/menu/DietaryIcon";

interface MenuItemCardProps {
  name: string;
  description?: string;
  price: number;
  photo?: any; // Sanity image object
  dietaryTags?: string[];
  isAvailable?: boolean;
}

export default function MenuItemCard({
  name,
  description,
  price,
  photo,
  dietaryTags,
  isAvailable = true,
}: MenuItemCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden",
        "hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200",
        !isAvailable && "opacity-80"
      )}
    >
      {/* Image area */}
      <div className="relative">
        {photo ? (
          <SanityImage
            image={photo}
            alt={name}
            width={640}
            height={427}
            className={cn(
              "w-full h-auto object-cover aspect-[3/2]",
              !isAvailable && "opacity-60"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div
            className={cn(
              "aspect-[3/2] bg-muted flex items-center justify-center",
              !isAvailable && "opacity-60"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-border"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
          </div>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-sm font-medium">
            Currently Unavailable
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-6">
        <h3 className="font-heading text-xl md:text-2xl leading-[1.2]">
          {name}
        </h3>

        {description && (
          <p className="text-sm text-secondary line-clamp-2 mt-1">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg md:text-xl font-medium">
            {formatPrice(price)}
          </span>

          {dietaryTags && dietaryTags.length > 0 && (
            <div className="flex gap-1.5">
              {dietaryTags.map((tag) => (
                <DietaryIcon
                  key={tag}
                  tag={tag as "V" | "VG" | "GF"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
