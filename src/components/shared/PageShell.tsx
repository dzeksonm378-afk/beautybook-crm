type PageShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children: React.ReactNode;
  darkIntro?: boolean;
};

export function PageShell({
  eyebrow,
  title,
  description,
  children,
  darkIntro = true,
}: PageShellProps) {
  return (
    <main className="min-h-screen bg-porcelain text-graphite">
      <section
        className={`px-5 py-12 sm:px-8 lg:px-10 ${
          darkIntro
            ? "bg-[radial-gradient(circle_at_top_left,rgba(200,169,106,0.28),transparent_32%),linear-gradient(135deg,var(--color-graphite),var(--color-plum))] text-porcelain"
            : ""
        }`}
      >
        <div className="mx-auto max-w-6xl">
          {eyebrow ? (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-champagne">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-4xl leading-tight sm:text-6xl">
            {title}
          </h1>
          <p
            className={`mt-5 max-w-2xl text-base leading-7 sm:text-lg ${
              darkIntro ? "text-porcelain/75" : "text-graphite/70"
            }`}
          >
            {description}
          </p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
        {children}
      </section>
    </main>
  );
}
