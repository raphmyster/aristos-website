import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Button from "@/components/shared/Button";
import MenuItemCard from "@/components/menu/MenuItemCard";

interface MenuHighlightsProps {
  heading?: string;
  viewMenuText?: string;
  items: Array<{
    _id: string;
    name: string;
    description?: string;
    price: number;
    photo?: any;
    dietaryTags?: string[];
  }>;
}

export default function MenuHighlights({
  heading,
  viewMenuText,
  items,
}: MenuHighlightsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionHeading>{heading || "Our Menu"}</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {items.map((item) => (
            <MenuItemCard
              key={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              photo={item.photo}
              dietaryTags={item.dietaryTags}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="secondary" href="/menu">
            {viewMenuText || "View Menu"}
          </Button>
        </div>
      </Container>
    </section>
  );
}
