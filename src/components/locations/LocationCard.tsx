import GoogleMap from "@/components/shared/GoogleMap";
import Button from "@/components/shared/Button";
import { formatPhoneHref } from "@/lib/utils";
import { MapPin, Phone } from "lucide-react";

interface LocationCardProps {
  name: string;
  address: string;
  phone?: string;
  googleMapsEmbed?: string;
  googleMapsLink?: string;
  hours?: Array<{
    day: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
  isPrimary?: boolean;
}

export default function LocationCard({
  name,
  address,
  phone,
  googleMapsEmbed,
  googleMapsLink,
  hours,
  isPrimary,
}: LocationCardProps) {
  return (
    <div className="bg-white border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
      {googleMapsEmbed && (
        <GoogleMap
          embedUrl={googleMapsEmbed}
          title={`Map of ${name}`}
          className="rounded-none border-0"
        />
      )}

      <div className="p-6">
        <h3 className="font-heading text-xl md:text-2xl">
          {name}
          {isPrimary && (
            <span className="bg-primary-light text-primary text-xs font-medium rounded-full px-3 py-1 ml-2">
              Primary
            </span>
          )}
        </h3>

        <p className="text-secondary mt-2 flex items-start gap-2">
          <MapPin size={18} className="mt-0.5 shrink-0" />
          {address}
        </p>

        {phone && (
          <a
            href={formatPhoneHref(phone)}
            className="text-secondary hover:text-primary transition-colors mt-2 flex items-center gap-2"
          >
            <Phone size={18} />
            {phone}
          </a>
        )}

        {hours && hours.length > 0 && (
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider text-foreground mb-2 mt-4">
              Hours
            </h4>
            {hours.map((entry) => (
              <div
                key={entry.day}
                className="flex justify-between text-sm py-1"
              >
                <span>{entry.day}</span>
                <span className={entry.isClosed ? "text-secondary" : ""}>
                  {entry.isClosed
                    ? "Closed"
                    : `${entry.openTime} - ${entry.closeTime}`}
                </span>
              </div>
            ))}
          </div>
        )}

        {googleMapsLink && (
          <Button variant="outline" size="sm" href={googleMapsLink} className="mt-4">
            Get Directions
          </Button>
        )}
      </div>
    </div>
  );
}
