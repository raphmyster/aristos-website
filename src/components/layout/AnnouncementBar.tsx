import { AnnouncementBarClient } from "./AnnouncementBarClient";

interface AnnouncementBarProps {
  enabled: boolean;
  text: string;
  link?: string;
  style: "info" | "warning" | "celebration";
}

export function AnnouncementBar({
  enabled,
  text,
  link,
  style,
}: AnnouncementBarProps) {
  if (!enabled || !text) return null;

  return <AnnouncementBarClient text={text} link={link} style={style} />;
}
