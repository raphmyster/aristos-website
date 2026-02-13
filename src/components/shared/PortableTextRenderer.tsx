import { PortableText, type PortableTextComponents } from "@portabletext/react";

interface PortableTextRendererProps {
  value: any; // Portable Text array
  className?: string;
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-heading text-2xl md:text-[32px] leading-[1.2] tracking-[-0.01em] text-foreground mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading text-xl md:text-2xl leading-[1.2] tracking-[-0.01em] text-foreground mt-6 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-body font-semibold text-base md:text-lg text-foreground mt-4 mb-2">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-base leading-relaxed text-foreground mb-4">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-secondary mb-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-base leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-base leading-relaxed">{children}</li>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        className="text-primary underline hover:text-primary/80 transition-colors"
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={
          value?.href?.startsWith("http") ? "noopener noreferrer" : undefined
        }
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
  },
};

export default function PortableTextRenderer({
  value,
  className,
}: PortableTextRendererProps) {
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
