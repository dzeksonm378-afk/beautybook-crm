import Link from "next/link";

import { StatusBadge } from "@/components/shared/StatusBadge";

const slots = [
  ["Сегодня 15:30", "Анна", "Стрижка + укладка", "от 1 800 ₽"],
  ["Сегодня 18:00", "Мария", "Окрашивание", "от 4 500 ₽"],
  ["Завтра 11:00", "Дмитрий", "Мужская стрижка", "от 1 500 ₽"],
];

export function LiveSlots() {
  return (
    <section className="bg-porcelain px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <StatusBadge tone="preview">live preview</StatusBadge>
            <h2 className="mt-4 font-display text-4xl text-graphite sm:text-5xl">
              Живые свободные окна
            </h2>
          </div>
          <Link
            href="/booking"
            className="w-fit rounded-full bg-champagne px-5 py-3 text-sm font-bold text-graphite transition hover:bg-[#d7bd7b]"
          >
            Записаться
          </Link>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {slots.map(([time, master, service, price]) => (
            <article
              className="rounded-[28px] border border-taupe/25 bg-white/75 p-5 shadow-[0_20px_70px_rgba(37,19,31,0.08)]"
              key={`${time}-${master}`}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-plum">{time}</p>
                <span className="h-2.5 w-2.5 rounded-full bg-lime shadow-[0_0_24px_rgba(215,255,79,0.9)]" />
              </div>
              <h3 className="font-display text-3xl text-graphite">{service}</h3>
              <p className="mt-3 text-sm text-graphite/62">
                {master} · {price}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
