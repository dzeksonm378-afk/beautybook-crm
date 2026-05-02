import Link from "next/link";

import { AdminForbiddenState } from "@/components/admin/AdminAccessState";
import { MasterSubmitButton } from "@/components/masters/MasterSubmitButton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getAdminPageAccess } from "@/lib/admin/guards";
import {
  createMasterAction,
  toggleMasterStatusAction,
} from "@/lib/masters/actions";
import { getMasters } from "@/lib/masters/queries";

const errorMessages: Record<string, string> = {
  access: "CRM-контекст не готов. Проверьте профиль сотрудника и салон.",
  create_failed: "Не удалось добавить мастера. Попробуйте ещё раз.",
  duplicate_name: "Мастер с таким именем уже есть в этом салоне.",
  forbidden: "Недостаточно прав для этого действия.",
  update_failed: "Не удалось изменить статус мастера. Попробуйте ещё раз.",
  validation: "Проверьте имя мастера и контактные поля.",
};

type AdminMastersPageProps = {
  searchParams?: Promise<{
    created?: string;
    error?: string;
    q?: string;
    updated?: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    timeZone: "Europe/Moscow",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminMastersPage({
  searchParams,
}: AdminMastersPageProps) {
  const params = await searchParams;
  const access = await getAdminPageAccess("manageMasters");

  if (access.status !== "ready") {
    return <AdminForbiddenState />;
  }

  const query = params?.q?.trim() ?? "";
  const mastersResult = await getMasters({ q: query });
  const masters = mastersResult.masters;
  const errorMessage = params?.error ? errorMessages[params.error] : null;
  const created = params?.created === "1";
  const updated = params?.updated === "1";

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <StatusBadge tone="gold">данные CRM</StatusBadge>
              <StatusBadge tone="preview">текущий салон</StatusBadge>
            </div>
            <h1 className="font-display text-3xl leading-tight">Мастера</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-graphite/62">
              Команда текущего салона. Активные мастера позже будут доступны
              для записей и онлайн-слотов.
            </p>
          </div>

          <form
            action="/admin/masters"
            className="flex w-full flex-col gap-3 sm:max-w-lg sm:flex-row"
            method="get"
          >
            <label className="min-w-0 flex-1">
              <span className="sr-only">Поиск мастеров</span>
              <input
                className="h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition placeholder:text-graphite/35 focus:border-champagne focus:bg-white"
                defaultValue={query}
                name="q"
                placeholder="Имя или специализация"
                type="search"
              />
            </label>
            <button
              className="h-12 rounded-full border border-graphite bg-graphite px-5 text-sm font-bold text-porcelain transition hover:bg-plum"
              type="submit"
            >
              Найти
            </button>
            {query ? (
              <Link
                className="inline-flex h-12 items-center justify-center rounded-full border border-taupe/35 px-5 text-sm font-bold text-plum transition hover:border-champagne hover:text-graphite"
                href="/admin/masters"
              >
                Сбросить
              </Link>
            ) : null}
          </form>
        </div>

        {created ? (
          <p className="mt-5 rounded-[20px] border border-lime/25 bg-lime/10 px-4 py-3 text-sm font-semibold text-graphite">
            Мастер добавлен.
          </p>
        ) : null}

        {updated ? (
          <p className="mt-5 rounded-[20px] border border-lime/25 bg-lime/10 px-4 py-3 text-sm font-semibold text-graphite">
            Статус мастера обновлён.
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
            {errorMessage}
          </p>
        ) : null}

        {mastersResult.status === "error" ? (
          <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
            Не удалось загрузить мастеров. Данные не раскрыты, попробуйте
            обновить страницу.
          </p>
        ) : null}

        {mastersResult.status === "not_ready" ? (
          <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
            CRM-контекст не готов. Мастера не загружены.
          </p>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
            новый мастер
          </p>
          <h2 className="font-display text-2xl leading-tight">Новый мастер</h2>
          <p className="mt-2 text-sm leading-6 text-graphite/62">
            Пока это простой список команды без расписания, фото и связи с
            услугами. Эти данные помогут собрать будущую запись.
          </p>

          <form action={createMasterAction} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Имя
              </span>
              <input
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                maxLength={120}
                minLength={2}
                name="fullName"
                placeholder="Мария Петрова"
                required
                type="text"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Специализация
              </span>
              <input
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                maxLength={120}
                name="specialization"
                placeholder="Стрижки и окрашивание"
                type="text"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Телефон
              </span>
              <input
                autoComplete="tel"
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                maxLength={30}
                name="phone"
                placeholder="+7 999 000-00-02"
                type="tel"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Email
              </span>
              <input
                autoComplete="email"
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                name="email"
                placeholder="master@example.com"
                type="email"
              />
            </label>

            <MasterSubmitButton
              idleText="Добавить мастера"
              pendingText="Добавляем..."
            />
          </form>
        </article>

        <article className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
                команда
              </p>
              <h2 className="font-display text-2xl leading-tight">
                Список мастеров
              </h2>
            </div>
            <StatusBadge tone={masters.length > 0 ? "live" : "preview"}>
              {masters.length} всего
            </StatusBadge>
          </div>

          {masters.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-taupe/35 bg-porcelain/60 p-6">
              <h3 className="font-display text-2xl">Мастеров пока нет</h3>
              <p className="mt-2 text-sm leading-6 text-graphite/62">
                Добавьте первого мастера, чтобы администратор мог создавать записи.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {masters.map((master) => (
                <div
                  className="rounded-[24px] border border-taupe/25 bg-white/60 p-4"
                  key={master.id}
                >
                  <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_auto] lg:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="min-w-0 truncate font-semibold">
                          {master.full_name}
                        </h3>
                        <StatusBadge tone={master.is_active ? "live" : "taupe"}>
                          {master.is_active ? "Активен" : "Отключён"}
                        </StatusBadge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-graphite/62">
                        {master.specialization ?? "Специализация не добавлена"}
                      </p>
                      <p className="mt-2 text-xs text-graphite/50">
                        Добавлен: {formatDate(master.created_at)}
                      </p>
                    </div>

                    <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-plum/45">
                          Телефон
                        </p>
                        <p className="mt-1 truncate font-semibold text-graphite/72">
                          {master.phone ?? "Не указан"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-plum/45">
                          Email
                        </p>
                        <p className="mt-1 truncate font-semibold text-graphite/72">
                          {master.email ?? "Не указан"}
                        </p>
                      </div>
                    </div>

                    <form action={toggleMasterStatusAction}>
                      <input name="masterId" type="hidden" value={master.id} />
                      <MasterSubmitButton
                        idleText={master.is_active ? "Отключить" : "Включить"}
                        pendingText="Обновляем..."
                        variant="secondary"
                      />
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
