import Link from "next/link";
import { Instagram, Facebook, Phone } from "lucide-react";
import { cn, formatPhoneHref } from "@/lib/utils";
import Container from "@/components/shared/Container";
import SanityImage from "@/components/shared/SanityImage";

interface FooterProps {
  name: string;
  tagline?: string;
  logo?: any;
  phone?: string;
  email?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  enableCatering?: boolean;
  enableCareers?: boolean;
  enableAllergens?: boolean;
  primaryLocation?: {
    address: string;
    hours?: Array<{
      day: string;
      openTime: string;
      closeTime: string;
      isClosed: boolean;
    }>;
  };
}

function SocialIcon({ platform }: { platform: string }) {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <Instagram size={20} />;
    case "facebook":
      return <Facebook size={20} />;
    default:
      return <span className="text-sm">{platform}</span>;
  }
}

export default function Footer({
  name,
  tagline,
  logo,
  phone,
  email,
  socialLinks,
  enableCatering,
  enableCareers,
  enableAllergens,
  primaryLocation,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-white/90 py-16">
      <Container>
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1 — Brand */}
          <div>
            {logo ? (
              <SanityImage
                image={logo}
                alt={name}
                width={120}
                height={40}
              />
            ) : (
              <span className="text-xl font-heading text-white">{name}</span>
            )}
            {tagline && (
              <p className="text-sm text-white/60 mt-2">{tagline}</p>
            )}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex gap-4 mt-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2 — Menu */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Menu
            </h3>
            <nav className="space-y-0">
              <Link
                href="/menu"
                className="block text-white/60 hover:text-white transition-colors py-1"
              >
                Menu
              </Link>
              {enableCatering && (
                <Link
                  href="/catering"
                  className="block text-white/60 hover:text-white transition-colors py-1"
                >
                  Catering
                </Link>
              )}
              <Link
                href="/locations"
                className="block text-white/60 hover:text-white transition-colors py-1"
              >
                Locations
              </Link>
            </nav>
          </div>

          {/* Column 3 — Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Info
            </h3>
            <nav className="space-y-0">
              {enableCareers && (
                <Link
                  href="/careers"
                  className="block text-white/60 hover:text-white transition-colors py-1"
                >
                  Careers
                </Link>
              )}
              {enableAllergens && (
                <Link
                  href="/allergens"
                  className="block text-white/60 hover:text-white transition-colors py-1"
                >
                  Allergens
                </Link>
              )}
              <Link
                href="/privacy"
                className="block text-white/60 hover:text-white transition-colors py-1"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="block text-white/60 hover:text-white transition-colors py-1"
              >
                Terms
              </Link>
            </nav>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            {primaryLocation?.address && (
              <p className="text-white/60 text-sm">{primaryLocation.address}</p>
            )}
            {phone && (
              <a
                href={formatPhoneHref(phone)}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mt-2"
              >
                <Phone size={16} />
                <span className="text-sm">{phone}</span>
              </a>
            )}
            {primaryLocation?.hours && primaryLocation.hours.length > 0 && (
              <p className="text-white/60 text-sm mt-2">
                {(() => {
                  const openDay = primaryLocation.hours!.find(
                    (h) => !h.isClosed
                  );
                  if (openDay) {
                    return `${openDay.openTime} – ${openDay.closeTime}`;
                  }
                  return "See location for hours";
                })()}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <p className="text-sm text-white/40 text-center">
            &copy; {currentYear} {name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
