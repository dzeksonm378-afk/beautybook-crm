import Link from "next/link";

const fields = [
  ["Услуга", "Стрижка + укладка"],
  ["Мастер", "Любой подходящий"],
  ["Дата", "Сегодня"],
];

export function BookingDock() {
  return (
    <section className="-mt-10 px-5 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-3 rounded-[32px] border border-taupe/25 bg-porcelain/95 p-4 shadow-[0_28px_90px_rgba(37,19,31,0.18)] backdrop-blur lg:grid-cols-[1fr_1fr_1fr_auto]">
        {fields.map(([label, value]) => (
          <div className="rounded-full border border-taupe/25 bg-white/70 px-5 py-4" key={label}>
            <p className="text-xs uppercase tracking-[0.2em] text-plum/45">
              {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-graphite">{value}</p>
          </div>
        ))}
        <Link
          href="/booking"
          className="inline-flex min-h-14 items-center justify-center rounded-full bg-graphite px-6 text-sm font-bold text-porcelain transition hover:bg-plum"
        >
          Найти свободное окно
        </Link>
      </div>
    </section>
  );
}
