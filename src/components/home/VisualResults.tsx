const results = [
  {
    title: "Окрашивание",
    caption: "Глубокий тон и мягкий блеск",
    tag: "color",
    visual:
      "bg-[linear-gradient(135deg,#3a2031_0%,#9b6f78_42%,#f1d7b5_100%)]",
  },
  {
    title: "Стрижка",
    caption: "Чистая форма на каждый день",
    tag: "shape",
    visual:
      "bg-[linear-gradient(145deg,#0d0d0c_0%,#514238_48%,#c8a96a_100%)]",
  },
  {
    title: "Укладка",
    caption: "Лёгкий объём и движение",
    tag: "style",
    visual:
      "bg-[linear-gradient(135deg,#f4efe7_0%,#cbb5a3_46%,#5b3f4d_100%)]",
  },
  {
    title: "Уход",
    caption: "Текстура, гладкость, сияние",
    tag: "care",
    visual:
      "bg-[linear-gradient(145deg,#d7ff4f_0%,#d7c8a1_32%,#25131f_100%)]",
  },
  {
    title: "До / после",
    caption: "Акцент на заметный результат",
    tag: "before",
    visual:
      "bg-[linear-gradient(90deg,#2b241f_0%,#2b241f_49%,#f4efe7_50%,#c8a96a_100%)]",
  },
  {
    title: "Вечерний образ",
    caption: "Финиш для события",
    tag: "event",
    visual:
      "bg-[linear-gradient(135deg,#130911_0%,#4f2440_45%,#b8a99a_100%)]",
  },
];

export function VisualResults() {
  return (
    <section className="bg-porcelain px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-plum/55">
              visual results
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-graphite sm:text-5xl">
              Работы мастеров
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-graphite/62">
            Без чужих фото: безопасные визуальные карточки показывают настроение
            услуг и помогают быстрее выбрать образ.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => (
            <article
              className="overflow-hidden rounded-[28px] border border-taupe/25 bg-white/70 shadow-[0_24px_80px_rgba(37,19,31,0.08)]"
              key={item.title}
            >
              <div className={`aspect-[5/4] ${item.visual} p-4`}>
                <div className="flex h-full flex-col justify-between rounded-[22px] border border-white/22 p-4 text-white/88">
                  <span className="w-fit rounded-full bg-black/18 px-3 py-1 text-xs uppercase tracking-[0.18em]">
                    {item.tag}
                  </span>
                  <span className="font-display text-5xl leading-none text-white/90">
                    {item.title.slice(0, 1)}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl leading-tight text-graphite">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-graphite/62">
                  {item.caption}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
