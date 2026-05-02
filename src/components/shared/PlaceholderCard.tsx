type PlaceholderCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  dark?: boolean;
};

export function PlaceholderCard({
  eyebrow,
  title,
  description,
  children,
  className = "",
  dark = false,
}: PlaceholderCardProps) {
  return (
    <article
      className={`rounded-[28px] border p-6 ${
        dark
          ? "border-white/10 bg-white/[0.06] text-porcelain shadow-2xl shadow-black/20 backdrop-blur"
          : "border-taupe/25 bg-white/70 text-graphite shadow-[0_24px_80px_rgba(37,19,31,0.08)]"
      } ${className}`}
    >
      {eyebrow ? (
        <p
          className={`mb-3 text-xs font-semibold uppercase tracking-[0.22em] ${
            dark ? "text-champagne" : "text-plum/65"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h3 className="font-display text-2xl leading-tight">{title}</h3>
      {description ? (
        <p
          className={`mt-3 text-sm leading-6 ${
            dark ? "text-porcelain/70" : "text-graphite/65"
          }`}
        >
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </article>
  );
}
