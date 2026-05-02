import Link from "next/link";

const links = [
  { href: "/services", label: "Услуги" },
  { href: "/masters", label: "Мастера" },
  { href: "/booking", label: "Онлайн-запись" },
  { href: "/contacts", label: "Контакты" },
  { href: "/login", label: "CRM" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-taupe/20 bg-porcelain px-5 py-10 text-graphite sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-3xl">BeautyBook CRM</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-graphite/65">
            Санкт-Петербург. Премиальная онлайн-запись и визуальный фундамент
            мини-CRM для beauty-бизнеса.
          </p>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm text-graphite/70">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="rounded-full border border-taupe/30 px-4 py-2 transition hover:border-champagne hover:text-plum"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
