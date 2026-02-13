import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface SanityImageProps {
  image: any; // Sanity image object
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export default function SanityImage({
  image,
  alt,
  width,
  height,
  fill,
  sizes,
  priority,
  className,
}: SanityImageProps) {
  if (!image) return null;

  const src = urlFor(image).url();

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
