import Link from "next/link";

import { PlaceholderCard } from "@/components/shared/PlaceholderCard";

const services = [
  ["Онлайн-запись", "Клиент выбирает услугу, мастера и свободное время."],
  ["Клиенты", "Единая база, история визитов и аккуратный поиск."],
  ["Услуги", "Каталог с ценами, длительностью и категориями."],
  ["Мастера", "Специализации, активность и будущая загрузка."],
  ["Расписание", "Слоты, статусы и контроль пересечений."],
  ["Аналитика", "Выручка, популярные услуги и no-show."],
];

export function FeaturedServices() {
  return (
    <section className="bg-porcelain px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-plum/55">
              system
            </p>
            <h2 className="mt-3 font-display text-4xl text-graphite sm:text-5xl">
              Что умеет система
            </h2>
          </div>
          <Link
            href="/services"
            className="w-fit rounded-full border border-taupe/35 px-5 py-3 text-sm font-semibold text-plum transition hover:border-champagne hover:text-graphite"
          >
            Смотреть услуги
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([title, description]) => (
            <PlaceholderCard
              description={description}
              key={title}
              title={title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
