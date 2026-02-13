interface DietaryIconProps {
  tag: "V" | "VG" | "GF";
}

const tagStyles: Record<DietaryIconProps["tag"], string> = {
  V: "bg-[#ECFDF5] text-[#065F46]",
  VG: "bg-[#D1FAE5] text-[#065F46]",
  GF: "bg-[#FEF3C7] text-[#92400E]",
};

export default function DietaryIcon({ tag }: DietaryIconProps) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase ${tagStyles[tag]}`}
    >
      {tag}
    </span>
  );
}
