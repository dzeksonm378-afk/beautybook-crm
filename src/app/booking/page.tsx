import Link from "next/link";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageShell } from "@/components/shared/PageShell";
import { StatusBadge } from "@/components/shared/StatusBadge";

const steps = [
  "Услуга",
  "Детали",
  "Мастер",
  "Дата и время",
  "Контакты",
  "Подтверждение",
];

export default function BookingPage() {
  return (
    <>
      <PublicHeader />
      <PageShell
        description="Клиентская запись будет работать без аккаунта: клиенту понадобится только имя и телефон. CRM-вход нужен только сотрудникам салона."
        eyebrow="онлайн-запись"
        title="Запись, понятная за 60 секунд"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[32px] border border-taupe/25 bg-white/75 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  className="rounded-[24px] border border-taupe/25 bg-porcelain/70 p-4"
                  key={step}
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-plum/45">
                    step {index + 1}
                  </p>
                  <p className="mt-2 font-display text-2xl text-graphite">
                    {step}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[28px] border border-champagne/35 bg-champagne/10 p-5">
              <StatusBadge tone="preview">режим превью</StatusBadge>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-graphite/68">
                Интерактивная запись будет публичной и не потребует регистрации.
                Клиент выберет услугу, мастера, дату и время, затем оставит
                имя и телефон. Контактные поля ниже пока не собирают реальные
                клиентские данные.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <input
                  disabled
                  placeholder="Имя клиента — preview"
                  className="h-12 rounded-full border border-taupe/25 bg-white/60 px-5 text-sm text-graphite/55"
                />
                <input
                  disabled
                  placeholder="+7 (___) ___-__-__"
                  className="h-12 rounded-full border border-taupe/25 bg-white/60 px-5 text-sm text-graphite/55"
                />
              </div>
            </div>
          </div>
          <aside className="rounded-[32px] border border-plum/10 bg-plum p-6 text-porcelain shadow-[0_24px_80px_rgba(37,19,31,0.16)]">
            <StatusBadge tone="live">Превью</StatusBadge>
            <h2 className="mt-5 font-display text-3xl">Итог записи</h2>
            <dl className="mt-6 space-y-4 text-sm">
              {[
                ["Услуга", "Стрижка + укладка"],
                ["Мастер", "Любой подходящий"],
                ["Цена", "от 1 800 ₽"],
                ["Длительность", "60 мин"],
              ].map(([label, value]) => (
                <div className="flex justify-between gap-5" key={label}>
                  <dt className="text-porcelain/55">{label}</dt>
                  <dd className="text-right font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href="/contacts"
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full border border-champagne/40 text-sm font-bold text-champagne transition hover:bg-champagne hover:text-graphite"
            >
              Связаться с салоном
            </Link>
          </aside>
        </div>
      </PageShell>
      <PublicFooter />
    </>
  );
}
