import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";

interface CateringHeroProps {
  heading?: string;
  description?: string;
}

export default function CateringHero({
  heading = "Catering",
  description,
}: CateringHeroProps) {
  return (
    <section className="bg-muted py-12 md:py-16">
      <Container className="text-center">
        <SectionHeading as="h1">{heading}</SectionHeading>
        {description && (
          <p className="text-secondary text-base max-w-2xl mx-auto mt-4">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
