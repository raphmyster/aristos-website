import Button from "@/components/shared/Button";
import PortableTextRenderer from "@/components/shared/PortableTextRenderer";
import { MapPin } from "lucide-react";

interface JobCardProps {
  title: string;
  description?: any; // Portable Text
  location?: string;
  type?: "full-time" | "part-time" | "seasonal";
  applyUrl?: string;
  applyEmail?: string;
  postedDate?: string;
}

function formatJobType(type: string): string {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function JobCard({
  title,
  description,
  location,
  type,
  applyUrl,
  applyEmail,
  postedDate,
}: JobCardProps) {
  const applyHref = applyUrl || (applyEmail ? `mailto:${applyEmail}` : undefined);

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-heading text-xl md:text-2xl">{title}</h3>
        {type && (
          <span className="bg-primary-light text-primary text-xs font-medium rounded-full px-3 py-1 whitespace-nowrap">
            {formatJobType(type)}
          </span>
        )}
      </div>

      {location && (
        <p className="text-sm text-secondary mt-2 flex items-center gap-2">
          <MapPin size={16} />
          {location}
        </p>
      )}

      {postedDate && (
        <p className="text-sm text-secondary mt-1">
          Posted{" "}
          {new Date(postedDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      )}

      {description && (
        <div className="max-h-32 overflow-hidden">
          <PortableTextRenderer value={description} className="mt-4" />
        </div>
      )}

      {applyHref && (
        <Button variant="primary" href={applyHref} className="mt-4">
          Apply Now
        </Button>
      )}
    </div>
  );
}
