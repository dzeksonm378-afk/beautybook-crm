import Link from "next/link";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageShell } from "@/components/shared/PageShell";
import { StatusBadge } from "@/components/shared/StatusBadge";

const services = [
  {
    category: "Hair",
    title: "Стрижка + укладка",
    description: "Форма, текстура и финальная укладка под образ клиента.",
    price: "от 1 800 ₽",
    duration: "60 мин",
  },
  {
    category: "Color",
    title: "Окрашивание",
    description: "Персональный оттенок, консультация и бережная техника.",
    price: "от 4 500 ₽",
    duration: "150 мин",
  },
  {
    category: "Tone",
    title: "Тонирование",
    description: "Обновление цвета и сияния между основными визитами.",
    price: "от 2 900 ₽",
    duration: "90 мин",
  },
  {
    category: "Care",
    title: "Уход и восстановление",
    description: "Премиальный уход для мягкости, блеска и плотности волос.",
    price: "от 2 400 ₽",
    duration: "75 мин",
  },
  {
    category: "Barber",
    title: "Мужская стрижка",
    description: "Чистая форма, камуфляж и быстрый ежедневный стиль.",
    price: "от 1 500 ₽",
    duration: "45 мин",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PublicHeader activePath="/services" />
      <PageShell
        description="Публичный каталог услуг помогает клиенту быстрее понять стоимость, длительность и следующий шаг к записи."
        eyebrow="public catalog"
        title="Каталог услуг, который помогает клиенту выбрать быстрее."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {services.map((service) => (
            <article
              className="rounded-[30px] border border-taupe/25 bg-white/75 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]"
              key={service.title}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <StatusBadge tone="preview">{service.category}</StatusBadge>
                <span className="text-sm text-graphite/55">
                  {service.duration}
                </span>
              </div>
              <h2 className="font-display text-3xl text-graphite">
                {service.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-graphite/65">
                {service.description}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-display text-2xl text-plum">
                  {service.price}
                </p>
                <Link
                  href="/booking"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-champagne px-5 text-sm font-bold text-graphite transition hover:bg-[#d7bd7b]"
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
