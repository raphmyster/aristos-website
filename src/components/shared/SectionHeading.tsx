import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}

const headingStyles: Record<NonNullable<SectionHeadingProps["as"]>, string> = {
  h1: "font-heading text-[30px] md:text-[40px]",
  h2: "font-heading text-2xl md:text-[32px]",
  h3: "font-heading text-xl md:text-2xl",
  h4: "font-body font-semibold text-base md:text-lg",
};

export default function SectionHeading({
  children,
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <Tag
      className={cn(
        "leading-[1.2] tracking-[-0.01em] text-foreground",
        headingStyles[Tag],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
