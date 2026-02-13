import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
