import Link from "next/link";

const navigation = [
  { href: "/services", label: "Услуги" },
  { href: "/masters", label: "Мастера" },
  { href: "/booking", label: "Онлайн-запись" },
  { href: "/contacts", label: "Контакты" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-graphite/90 px-4 py-3 text-porcelain backdrop-blur-xl sm:px-8 sm:py-4 lg:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 sm:gap-5">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-champagne/35 bg-champagne/10 font-display text-base text-champagne sm:h-9 sm:w-9 sm:text-lg">
            B
          </span>
          <span className="truncate font-display text-lg leading-none sm:text-xl">
            BeautyBook CRM
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-porcelain/75 md:flex">
          {navigation.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className="transition hover:text-champagne"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-champagne/35 px-3 text-sm font-semibold text-champagne transition hover:bg-champagne hover:text-graphite sm:h-10 sm:px-4"
        >
          <span className="sm:hidden">CRM</span>
          <span className="hidden sm:inline">Войти в CRM</span>
        </Link>
      </div>
      <nav className="mx-auto mt-3 grid max-w-6xl grid-cols-2 gap-2 text-sm text-porcelain/75 md:hidden">
        {navigation.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className="rounded-full border border-white/10 px-3 py-2 text-center"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
