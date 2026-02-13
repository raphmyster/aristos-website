import { Phone } from "lucide-react";
import { formatPhoneHref } from "@/lib/utils";
import Container from "@/components/shared/Container";
import Button from "@/components/shared/Button";
import SanityImage from "@/components/shared/SanityImage";

interface OrderStripProps {
  deliveryApps?: Array<{ name: string; url: string; logo?: any }>;
  phone?: string;
  orderButtonText?: string;
}

export default function OrderStrip({
  deliveryApps,
  phone,
  orderButtonText,
}: OrderStripProps) {
  const hasDeliveryApps = deliveryApps && deliveryApps.length > 0;
  const hasPhone = !!phone;

  if (!hasDeliveryApps && !hasPhone) {
    return null;
  }

  return (
    <section className="bg-muted py-6">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {hasDeliveryApps && (
            <div className="flex items-center gap-6">
              {deliveryApps.map((app) => (
                <a
                  key={app.name}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {app.logo ? (
                    <SanityImage
                      image={app.logo}
                      alt={app.name}
                      height={32}
                      width={120}
                      className="h-8 w-auto grayscale hover:grayscale-0 transition-all duration-200"
                    />
                  ) : (
                    <span className="text-sm font-medium text-secondary hover:text-foreground transition-colors">
                      {app.name}
                    </span>
                  )}
                </a>
              ))}
            </div>
          )}

          {hasDeliveryApps && hasPhone && (
            <div className="hidden sm:block w-px h-8 bg-border" />
          )}

          {hasPhone && (
            <Button variant="secondary" size="sm" href={formatPhoneHref(phone)}>
              <Phone className="mr-2" size={16} />
              {orderButtonText || phone}
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
