import Link from "next/link";

import { AdminForbiddenState } from "@/components/admin/AdminAccessState";
import { ServiceSubmitButton } from "@/components/services/ServiceSubmitButton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getAdminPageAccess } from "@/lib/admin/guards";
import {
  createServiceAction,
  toggleServiceStatusAction,
} from "@/lib/services/actions";
import { getServices } from "@/lib/services/queries";
import { serviceCategories } from "@/lib/validations/service.schema";

const errorMessages: Record<string, string> = {
  access: "CRM-контекст не готов. Проверьте профиль сотрудника и салон.",
  create_failed: "Не удалось добавить услугу. Попробуйте ещё раз.",
  duplicate_title: "Услуга с таким названием уже есть в этом салоне.",
  forbidden: "Недостаточно прав для этого действия.",
  update_failed: "Не удалось изменить статус услуги. Попробуйте ещё раз.",
  validation: "Проверьте название, категорию, цену и длительность услуги.",
};

type AdminServicesPageProps = {
  searchParams?: Promise<{
    category?: string;
    created?: string;
    error?: string;
    q?: string;
    updated?: string;
  }>;
};

function formatPrice(value: number | string) {
  const price = typeof value === "string" ? Number(value) : value;

  if (!Number.isFinite(price)) {
    return "0 ₽";
  }

  return new Intl.NumberFormat("ru-RU", {
    currency: "RUB",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(price);
}

function getDescriptionPreview(description: string | null) {
  if (!description) {
    return null;
  }

  const compactDescription = description.trim().replace(/\s+/g, " ");

  if (compactDescription.length <= 110) {
    return compactDescription;
  }

  return `${compactDescription.slice(0, 110)}...`;
}

export default async function AdminServicesPage({
  searchParams,
}: AdminServicesPageProps) {
  const params = await searchParams;
  const access = await getAdminPageAccess("manageServices");

  if (access.status !== "ready") {
    return <AdminForbiddenState />;
  }

  const query = params?.q?.trim() ?? "";
  const category = params?.category?.trim() ?? "";
  const servicesResult = await getServices({ category, q: query });
  const services = servicesResult.services;
  const errorMessage = params?.error ? errorMessages[params.error] : null;
  const created = params?.created === "1";
  const updated = params?.updated === "1";
  const hasFilters = query || category;

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <StatusBadge tone="gold">данные CRM</StatusBadge>
              <StatusBadge tone="preview">текущий салон</StatusBadge>
            </div>
            <h1 className="font-display text-3xl leading-tight">Услуги</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-graphite/62">
              Каталог услуг текущего салона. Цена и длительность позже будут
                использоваться для расчёта записи и фиксации цены визита.
            </p>
          </div>

          <form
            action="/admin/services"
            className="grid w-full gap-3 sm:grid-cols-[1fr_220px_auto_auto] xl:max-w-3xl"
            method="get"
          >
            <label className="min-w-0">
              <span className="sr-only">Поиск услуг</span>
              <input
                className="h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition placeholder:text-graphite/35 focus:border-champagne focus:bg-white"
                defaultValue={query}
                name="q"
                placeholder="Название или описание"
                type="search"
              />
            </label>
            <label>
              <span className="sr-only">Категория</span>
              <select
                className="h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                defaultValue={category}
                name="category"
              >
                <option value="">Все категории</option>
                {serviceCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="h-12 rounded-full border border-graphite bg-graphite px-5 text-sm font-bold text-porcelain transition hover:bg-plum"
              type="submit"
            >
              Найти
            </button>
            {hasFilters ? (
              <Link
                className="inline-flex h-12 items-center justify-center rounded-full border border-taupe/35 px-5 text-sm font-bold text-plum transition hover:border-champagne hover:text-graphite"
                href="/admin/services"
              >
                Сбросить
              </Link>
            ) : null}
          </form>
        </div>

        {created ? (
          <p className="mt-5 rounded-[20px] border border-lime/25 bg-lime/10 px-4 py-3 text-sm font-semibold text-graphite">
            Услуга добавлена.
          </p>
        ) : null}

        {updated ? (
          <p className="mt-5 rounded-[20px] border border-lime/25 bg-lime/10 px-4 py-3 text-sm font-semibold text-graphite">
            Статус услуги обновлён.
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
            {errorMessage}
          </p>
        ) : null}

        {servicesResult.status === "error" ? (
          <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
            Не удалось загрузить услуги. Данные не раскрыты, попробуйте обновить
            страницу.
          </p>
        ) : null}

        {servicesResult.status === "not_ready" ? (
          <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
            CRM-контекст не готов. Услуги не загружены.
          </p>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
            новая услуга
          </p>
          <h2 className="font-display text-2xl leading-tight">Новая услуга</h2>
          <p className="mt-2 text-sm leading-6 text-graphite/62">
            Простой MVP-каталог: название, категория, цена и длительность.
            Неактивные услуги останутся в CRM, но позже не попадут в онлайн-запись.
          </p>

          <form action={createServiceAction} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Название
              </span>
              <input
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                maxLength={120}
                minLength={2}
                name="title"
                placeholder="Стрижка и укладка"
                required
                type="text"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Категория
              </span>
              <select
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                name="category"
                required
              >
                {serviceCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                  Цена
                </span>
                <input
                  className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                  min={0}
                  name="price"
                  placeholder="1800"
                  required
                  step="0.01"
                  type="number"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                  Длительность
                </span>
                <input
                  className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                  max={600}
                  min={5}
                  name="durationMinutes"
                  placeholder="60"
                  required
                  step={5}
                  type="number"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Описание
              </span>
              <textarea
                className="mt-2 min-h-28 w-full resize-y rounded-[24px] border border-taupe/25 bg-porcelain/70 px-5 py-4 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                maxLength={1000}
                name="description"
                placeholder="Тестовая услуга для проверки CRM"
              />
            </label>

            <ServiceSubmitButton
              idleText="Добавить услугу"
              pendingText="Добавляем..."
            />
          </form>
        </article>

        <article className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
                каталог услуг
              </p>
              <h2 className="font-display text-2xl leading-tight">
                Список услуг
              </h2>
            </div>
            <StatusBadge tone={services.length > 0 ? "live" : "preview"}>
              {services.length} всего
            </StatusBadge>
          </div>

          {services.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-taupe/35 bg-porcelain/60 p-6">
              <h3 className="font-display text-2xl">Услуг пока нет</h3>
              <p className="mt-2 text-sm leading-6 text-graphite/62">
                Добавьте первую услугу, чтобы администратор мог создавать записи.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {services.map((service) => {
                const descriptionPreview = getDescriptionPreview(service.description);

                return (
                  <div
                    className="rounded-[24px] border border-taupe/25 bg-white/60 p-4"
                    key={service.id}
                  >
                    <div className="grid gap-4 lg:grid-cols-[1.25fr_0.85fr_auto] lg:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="min-w-0 truncate font-semibold">
                            {service.title}
                          </h3>
                          <StatusBadge tone={service.is_active ? "live" : "taupe"}>
                            {service.is_active ? "Активна" : "Отключена"}
                          </StatusBadge>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-graphite/62">
                          {descriptionPreview ?? "Описание не добавлено"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-1">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-plum/45">
                            Категория
                          </p>
                          <p className="mt-1 font-semibold">
                            {service.category ?? "Другое"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-plum/45">
                            Цена
                          </p>
                          <p className="mt-1 font-semibold">
                            {formatPrice(service.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-plum/45">
                            Время
                          </p>
                          <p className="mt-1 font-semibold">
                            {service.duration_minutes} мин
                          </p>
                        </div>
                      </div>

                      <form action={toggleServiceStatusAction}>
                        <input name="serviceId" type="hidden" value={service.id} />
                        <ServiceSubmitButton
                          idleText={service.is_active ? "Отключить" : "Включить"}
                          pendingText="Обновляем..."
                          variant="secondary"
                        />
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
