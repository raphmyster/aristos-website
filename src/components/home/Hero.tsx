import HeroClient from "./HeroClient";

interface HeroProps {
  heroImage?: any;
  heroHeadline?: string;
  heroSubheadline?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export default function Hero(props: HeroProps) {
  return <HeroClient {...props} />;
}
