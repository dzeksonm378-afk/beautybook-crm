import Link from "next/link";

const navigation = [
  { href: "/services", label: "Услуги" },
  { href: "/masters", label: "Мастера" },
  { href: "/booking", label: "Онлайн-запись" },
  { href: "/contacts", label: "Контакты" },
];

type PublicHeaderProps = {
  activePath?: string;
};

export function PublicHeader({ activePath }: PublicHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-graphite px-3 py-2 text-porcelain sm:px-8 sm:py-4 md:sticky md:top-0 md:z-30 md:bg-graphite/90 md:backdrop-blur-xl lg:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-5">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-champagne/35 bg-champagne/10 font-display text-sm text-champagne sm:h-9 sm:w-9 sm:text-lg">
            B
          </span>
          <span className="truncate font-display text-base leading-none sm:text-xl">
            BeautyBook CRM
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-porcelain/75 md:flex">
          {navigation.map((item) => {
            const isActive = activePath === item.href;

            return (
              <Link
                href={item.href}
                key={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`transition hover:text-champagne ${
                  isActive ? "font-semibold text-champagne" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/login"
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-full border border-white/15 px-2.5 text-xs font-semibold text-porcelain/68 transition hover:border-champagne/45 hover:text-champagne sm:h-10 sm:px-4 sm:text-sm"
        >
          <span className="sm:hidden">CRM</span>
          <span className="hidden sm:inline">Для сотрудников</span>
        </Link>
      </div>
      <nav className="mx-auto mt-2 grid max-w-6xl grid-cols-2 gap-1.5 text-xs text-porcelain/75 sm:mt-3 sm:gap-2 sm:text-sm md:hidden">
        {navigation.map((item) => {
          const isActive = activePath === item.href;

          return (
            <Link
              href={item.href}
              key={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-full border px-2 py-1.5 text-center transition sm:px-3 sm:py-2 ${
                isActive
                  ? "border-champagne bg-champagne text-graphite"
                  : "border-white/10 hover:border-champagne/45 hover:text-champagne"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
