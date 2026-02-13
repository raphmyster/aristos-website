"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import SanityImage from "@/components/shared/SanityImage";
import Button from "@/components/shared/Button";

interface HeroClientProps {
  heroImage?: any;
  heroHeadline?: string;
  heroSubheadline?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export default function HeroClient({
  heroImage,
  heroHeadline,
  heroSubheadline,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
}: HeroClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <section className="relative min-h-[500px] h-[70vh] md:h-[85vh] w-full overflow-hidden">
      {/* Background image */}
      <div
        className={cn(
          "absolute inset-0",
          "motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out",
          mounted
            ? "motion-safe:scale-100"
            : "motion-safe:scale-105",
        )}
      >
        {heroImage ? (
          <SanityImage
            image={heroImage}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-primary" />
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/55" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end justify-start">
        <div className="w-full px-4 pb-12 md:pb-24 md:px-16 text-center md:text-left">
          {/* Headline */}
          <div
            className={cn(
              "motion-safe:transition-all motion-safe:duration-500 motion-safe:delay-200",
              mounted
                ? "motion-safe:translate-y-0 motion-safe:opacity-100"
                : "motion-safe:translate-y-5 motion-safe:opacity-0",
            )}
          >
            <h1 className="font-heading text-4xl md:text-[56px] text-white leading-[1.2] [text-shadow:0_2px_8px_rgba(0,0,0,0.3)]">
              {heroHeadline || "Welcome"}
            </h1>
          </div>

          {/* Subheadline */}
          {heroSubheadline && (
            <div
              className={cn(
                "motion-safe:transition-all motion-safe:duration-500 motion-safe:delay-[350ms]",
                mounted
                  ? "motion-safe:translate-y-0 motion-safe:opacity-100"
                  : "motion-safe:translate-y-5 motion-safe:opacity-0",
              )}
            >
              <p className="text-base text-white/90 max-w-[480px] mt-4 mx-auto md:mx-0">
                {heroSubheadline}
              </p>
            </div>
          )}

          {/* CTAs */}
          <div
            className={cn(
              "motion-safe:transition-all motion-safe:duration-500 motion-safe:delay-500",
              mounted
                ? "motion-safe:translate-y-0 motion-safe:opacity-100"
                : "motion-safe:translate-y-5 motion-safe:opacity-0",
            )}
          >
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center md:justify-start">
              <Button variant="primary" size="lg" href={primaryCtaLink}>
                {primaryCtaText || "Order Now"}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href={secondaryCtaLink || "/menu"}
                className="border-white text-white hover:bg-white/10"
              >
                {secondaryCtaText || "View Menu"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
