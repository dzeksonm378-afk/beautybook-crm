import Link from "next/link";

import { StatusBadge } from "@/components/shared/StatusBadge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(200,169,106,0.22),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(215,255,79,0.13),transparent_20%),linear-gradient(135deg,var(--color-graphite),var(--color-plum)_68%,#130911)] px-5 py-16 text-porcelain sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <StatusBadge tone="gold">BeautyBook CRM</StatusBadge>
          <h1 className="mt-7 max-w-4xl font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
            Не просто запись. Новый стандарт beauty-сервиса.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-porcelain/72">
            Онлайн-запись, мастера, услуги, клиенты и аналитика — в
            премиальном интерфейсе для beauty-бизнеса.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/booking"
              className="inline-flex h-12 items-center justify-center rounded-full bg-champagne px-6 text-sm font-bold text-graphite shadow-[0_18px_60px_rgba(200,169,106,0.28)] transition hover:bg-[#d7bd7b]"
            >
              Записаться онлайн
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-bold text-porcelain transition hover:border-champagne/50 hover:text-champagne"
            >
              Смотреть CRM
            </Link>
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(145deg,rgba(244,239,231,0.13),rgba(200,169,106,0.08))] p-5 shadow-[0_32px_100px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="rounded-[30px] border border-white/12 bg-graphite/60 p-5">
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-porcelain/62">Сегодня · 17:30</p>
              <StatusBadge tone="live">Свободно сегодня</StatusBadge>
            </div>
            <div className="min-h-72 rounded-[28px] bg-[radial-gradient(circle_at_20%_20%,rgba(215,255,79,0.16),transparent_24%),radial-gradient(circle_at_80%_70%,rgba(200,169,106,0.22),transparent_28%),linear-gradient(135deg,#3A2031,#0D0D0C)] p-6">
              <div className="mt-auto flex h-full flex-col justify-end">
                <p className="text-sm uppercase tracking-[0.24em] text-champagne">
                  editorial slot
                </p>
                <h2 className="mt-4 font-display text-4xl leading-tight">
                  Стрижка + укладка
                </h2>
                <p className="mt-3 text-sm text-porcelain/72">
                  Анна · Top Stylist
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
                    60 мин
                  </span>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
                    от 1 800 ₽
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
