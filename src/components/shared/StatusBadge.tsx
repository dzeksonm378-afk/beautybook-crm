type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: "live" | "gold" | "taupe" | "danger" | "dark" | "preview";
};

const toneClassName: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  live: "border-lime/40 bg-lime/15 text-lime",
  gold: "border-champagne/35 bg-champagne/15 text-champagne",
  taupe: "border-taupe/35 bg-taupe/15 text-taupe",
  danger: "border-[#B86B6B]/35 bg-[#B86B6B]/15 text-[#F0B7B7]",
  dark: "border-white/10 bg-white/8 text-porcelain",
  preview: "border-plum/10 bg-plum/5 text-plum",
};

export function StatusBadge({ children, tone = "gold" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${toneClassName[tone]}`}
    >
      {children}
    </span>
  );
}
