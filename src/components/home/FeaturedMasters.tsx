import { PlaceholderCard } from "@/components/shared/PlaceholderCard";

const audiences = [
  "Салон красоты",
  "Барбершоп",
  "Мастер маникюра",
  "Косметолог",
  "Частный мастер",
];

export function FeaturedMasters() {
  return (
    <section className="bg-graphite px-5 py-16 text-porcelain sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-champagne">
          audience
        </p>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl">Для кого</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {audiences.map((item) => (
            <PlaceholderCard dark key={item} title={item}>
              <p className="text-sm leading-6 text-porcelain/65">
                Быстрый старт, понятные записи и визуально сильный клиентский
                опыт.
              </p>
            </PlaceholderCard>
          ))}
        </div>
      </div>
    </section>
  );
}
