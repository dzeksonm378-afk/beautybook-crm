import Link from "next/link";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageShell } from "@/components/shared/PageShell";

export default function ContactsPage() {
  return (
    <>
      <PublicHeader activePath="/contacts" />
      <PageShell
        description="Контакты салона и будущая точка входа для карты, мессенджеров и онлайн-записи."
        eyebrow="contacts"
        title="Санкт-Петербург. BeautyBook CRM."
      >
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] border border-taupe/25 bg-white/75 p-6">
            <dl className="space-y-5">
              {[
                ["Город", "Санкт-Петербург"],
                ["Телефон", "+7 (999) 000-00-00"],
                ["Будни", "10:00 — 21:00"],
                ["Выходные", "10:00 — 19:00"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-[0.22em] text-plum/45">
                    {label}
                  </dt>
                  <dd className="mt-1 font-display text-2xl text-graphite">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href="/booking"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-champagne px-6 text-sm font-bold text-graphite transition hover:bg-[#d7bd7b]"
            >
              Записаться онлайн
            </Link>
          </div>
          <div className="flex min-h-80 items-center justify-center rounded-[32px] border border-dashed border-taupe/40 bg-[linear-gradient(135deg,rgba(37,19,31,0.08),rgba(200,169,106,0.18))] p-8 text-center">
            <div>
              <p className="font-display text-4xl text-graphite">
                Карта будет подключена позже
              </p>
              <p className="mt-3 max-w-md text-sm leading-6 text-graphite/60">
                На MVP-этапе держим страницу статичной: без внешних карт,
                CDN и сторонних виджетов.
              </p>
            </div>
          </div>
        </div>
      </PageShell>
      <PublicFooter />
    </>
  );
}
