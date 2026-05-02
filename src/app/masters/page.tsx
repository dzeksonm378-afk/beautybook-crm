import Link from "next/link";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageShell } from "@/components/shared/PageShell";
import { StatusBadge } from "@/components/shared/StatusBadge";

const masters = [
  {
    name: "Анна",
    level: "Top Stylist",
    specialization: "Стрижки · Блонд · Окрашивание",
    rating: "4.9",
    slot: "сегодня 17:30",
  },
  {
    name: "Мария",
    level: "Color Expert",
    specialization: "Окрашивание · Тонирование · Уход",
    rating: "4.8",
    slot: "завтра 12:00",
  },
  {
    name: "Дмитрий",
    level: "Barber",
    specialization: "Мужские стрижки · Камуфляж",
    rating: "4.9",
    slot: "сегодня 19:00",
  },
];

export default function MastersPage() {
  return (
    <>
      <PublicHeader />
      <PageShell
        description="Editorial grid мастеров: специализация, уровень и ближайшее окно без раскрытия приватных данных команды."
        eyebrow="masters"
        title="Мастера, которых хочется выбрать."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {masters.map((master, index) => (
            <article
              className="overflow-hidden rounded-[32px] border border-taupe/25 bg-white/75 shadow-[0_24px_80px_rgba(37,19,31,0.08)]"
              key={master.name}
            >
              <div className="min-h-64 bg-[radial-gradient(circle_at_28%_20%,rgba(215,255,79,0.18),transparent_24%),radial-gradient(circle_at_80%_60%,rgba(200,169,106,0.28),transparent_28%),linear-gradient(135deg,var(--color-plum),var(--color-graphite))] p-5">
                <StatusBadge tone="dark">photo placeholder 0{index + 1}</StatusBadge>
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold text-champagne">
                  {master.level}
                </p>
                <h2 className="mt-2 font-display text-4xl text-graphite">
                  {master.name}
                </h2>
                <p className="mt-3 text-sm leading-6 text-graphite/65">
                  {master.specialization}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-plum/5 px-3 py-2 text-plum">
                    рейтинг {master.rating}
                  </span>
                  <span className="rounded-full bg-lime/35 px-3 py-2 text-graphite">
                    окно {master.slot}
                  </span>
                </div>
                <Link
                  href="/booking"
                  className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-graphite px-5 text-sm font-bold text-porcelain transition hover:bg-plum"
                >
                  Записаться
                </Link>
              </div>
            </article>
          ))}
        </div>
      </PageShell>
      <PublicFooter />
    </>
  );
}
