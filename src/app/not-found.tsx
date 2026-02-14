import Container from "@/components/shared/Container";
import Button from "@/components/shared/Button";

export default function NotFound() {
  return (
    <section className="py-24 md:py-32">
      <Container className="text-center">
        <p className="text-6xl md:text-8xl font-heading text-primary mb-4">
          404
        </p>
        <h1 className="font-heading text-2xl md:text-[32px] leading-[1.2] text-foreground">
          Looks like this page doesn&apos;t exist
        </h1>
        <p className="text-secondary mt-3 text-lg">
          But our food definitely does.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button variant="primary" href="/">
            Back to Home
          </Button>
          <Button variant="outline" href="/menu">
            View Our Menu
          </Button>
        </div>
      </Container>
    </section>
  );
}
