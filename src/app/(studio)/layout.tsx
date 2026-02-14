import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aristos Studio",
  description: "Aristos content management studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
