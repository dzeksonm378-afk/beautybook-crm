const metrics = [
  ["12", "записей сегодня"],
  ["386 000 ₽", "выручка за месяц"],
  ["78%", "загрузка мастеров"],
  ["2", "отмены"],
];

export function TrustBlock() {
  return (
    <section className="bg-[linear-gradient(135deg,var(--color-plum),var(--color-graphite))] px-5 py-16 text-porcelain sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-champagne">
            admin crm
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            CRM для администратора
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-porcelain/68">
            Записи сегодня, выручка, загрузка мастеров, no-show и ближайшие
            клиенты — в одном спокойном интерфейсе.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map(([value, label]) => (
            <div
              className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur"
              key={label}
            >
              <p className="font-display text-4xl text-champagne">{value}</p>
              <p className="mt-2 text-sm text-porcelain/62">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
