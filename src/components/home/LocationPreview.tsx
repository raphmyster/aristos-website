import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Button from "@/components/shared/Button";
import GoogleMap from "@/components/shared/GoogleMap";
import { MapPin, Phone } from "lucide-react";
import { formatPhoneHref } from "@/lib/utils";

interface LocationPreviewProps {
  heading?: string;
  location: {
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
  };
}

export default function LocationPreview({
  heading = "Find Us",
  location,
}: LocationPreviewProps) {
  const { name, address, phone, googleMapsEmbed, googleMapsLink, hours } =
    location;

  return (
    <section className="bg-muted py-12 md:py-16">
      <Container>
        <SectionHeading>{heading}</SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left column — Location Info */}
          <div>
            <h3 className="font-heading text-xl md:text-2xl">{name}</h3>

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
              <div className="mt-4">
                <h4 className="font-body font-semibold text-sm uppercase tracking-wider text-foreground mb-2">
                  Hours
                </h4>
                {hours.map((entry) => (
                  <div
                    key={entry.day}
                    className="flex justify-between text-sm py-1"
                  >
                    <span>{entry.day}</span>
                    {entry.isClosed ? (
                      <span className="text-secondary">Closed</span>
                    ) : (
                      <span>
                        {entry.openTime} &ndash; {entry.closeTime}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {googleMapsLink && (
              <Button variant="secondary" href={googleMapsLink} className="mt-6">
                Get Directions
              </Button>
            )}
          </div>

          {/* Right column — Map */}
          {googleMapsEmbed && (
            <div>
              <GoogleMap
                embedUrl={googleMapsEmbed}
                title={name + " location"}
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
