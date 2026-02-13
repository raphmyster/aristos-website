import { cn } from "@/lib/utils";

interface GoogleMapProps {
  embedUrl: string;
  title?: string;
  className?: string;
}

export default function GoogleMap({
  embedUrl,
  title,
  className,
}: GoogleMapProps) {
  return (
    <div
      className={cn(
        "aspect-[4/3] md:aspect-video rounded-lg border border-border overflow-hidden",
        className,
      )}
    >
      <iframe
        src={embedUrl}
        title={title || "Map"}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
