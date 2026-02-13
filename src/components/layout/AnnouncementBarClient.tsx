"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "announcement-dismissed";

interface AnnouncementBarClientProps {
  text: string;
  link?: string;
  style: "info" | "warning" | "celebration";
}

const styleVariants: Record<
  AnnouncementBarClientProps["style"],
  string
> = {
  info: "bg-primary-light text-primary",
  warning: "bg-[#FEF3C7] text-[#92400E]",
  celebration: "bg-primary text-white",
};

export function AnnouncementBarClient({
  text,
  link,
  style,
}: AnnouncementBarClientProps) {
  const [dismissed, setDismissed] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setDismissed(true);
    }
  }, []);

  function handleDismiss() {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setDismissing(true);
    setTimeout(() => setDismissed(true), 200);
  }

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center px-4",
        "text-sm font-medium font-body",
        "transition-all duration-200 ease-in-out overflow-hidden",
        dismissing ? "opacity-0 max-h-0" : "max-h-12",
        styleVariants[style],
      )}
    >
      <p className="py-2 text-center">
        {link ? (
          <a href={link} className="underline">
            {text}
          </a>
        ) : (
          text
        )}
      </p>

      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-4 hover:opacity-70"
        aria-label="Dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}
