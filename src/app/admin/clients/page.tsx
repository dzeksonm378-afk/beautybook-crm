import Link from "next/link";

import { AdminForbiddenState } from "@/components/admin/AdminAccessState";
import { ClientSubmitButton } from "@/components/clients/ClientSubmitButton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getAdminPageAccess } from "@/lib/admin/guards";
import { createClientAction } from "@/lib/clients/actions";
import { getClients } from "@/lib/clients/queries";

const errorMessages: Record<string, string> = {
  access: "CRM-контекст не готов. Проверьте профиль сотрудника и салон.",
  create_failed: "Не удалось добавить клиента. Попробуйте ещё раз.",
  duplicate_phone: "Клиент с таким телефоном уже есть в этом салоне.",
  forbidden: "Недостаточно прав для этого действия.",
  not_found: "Клиент не найден в текущем салоне.",
  validation: "Проверьте имя и телефон клиента.",
};

type AdminClientsPageProps = {
  searchParams?: Promise<{
    created?: string;
    error?: string;
    q?: string;
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

function getNotesPreview(notes: string | null) {
  if (!notes) {
    return null;
  }

  const compactNotes = notes.trim().replace(/\s+/g, " ");

  if (compactNotes.length <= 80) {
    return compactNotes;
  }

  return `${compactNotes.slice(0, 80)}...`;
}

export default async function AdminClientsPage({
  searchParams,
}: AdminClientsPageProps) {
  const params = await searchParams;
  const access = await getAdminPageAccess("manageClients");

  if (access.status !== "ready") {
    return <AdminForbiddenState />;
  }

  const query = params?.q?.trim() ?? "";
  const clientsResult = await getClients({ q: query });
  const clients = clientsResult.clients;
  const errorMessage = params?.error ? errorMessages[params.error] : null;
  const created = params?.created === "1";

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <StatusBadge tone="gold">данные CRM</StatusBadge>
              <StatusBadge tone="preview">текущий салон</StatusBadge>
            </div>
            <h1 className="font-display text-3xl leading-tight">Клиенты</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-graphite/62">
              База клиентов текущего салона. Клиенты не являются Supabase Auth
              users и не входят в CRM.
            </p>
          </div>

          <form action="/admin/clients" className="flex w-full flex-col gap-3 sm:max-w-lg sm:flex-row" method="get">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Поиск клиентов</span>
              <input
                className="h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition placeholder:text-graphite/35 focus:border-champagne focus:bg-white"
                defaultValue={query}
                name="q"
                placeholder="Имя или телефон"
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
                href="/admin/clients"
              >
                Сбросить
              </Link>
            ) : null}
          </form>
        </div>

        {created ? (
          <p className="mt-5 rounded-[20px] border border-lime/25 bg-lime/10 px-4 py-3 text-sm font-semibold text-graphite">
            Клиент добавлен.
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
            {errorMessage}
          </p>
        ) : null}

        {clientsResult.status === "error" ? (
          <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
            Не удалось загрузить клиентов. Данные не раскрыты, попробуйте обновить
            страницу.
          </p>
        ) : null}

        {clientsResult.status === "not_ready" ? (
          <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
            CRM-контекст не готов. Клиентские данные не загружены.
          </p>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
            новый клиент
          </p>
          <h2 className="font-display text-2xl leading-tight">Новый клиент</h2>
          <p className="mt-2 text-sm leading-6 text-graphite/62">
            Минимум данных для CRM: имя и телефон. Заметки остаются приватными
            внутри защищённой админки.
          </p>

          <form action={createClientAction} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Имя
              </span>
              <input
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                maxLength={120}
                minLength={2}
                name="fullName"
                placeholder="Анна Иванова"
                required
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
                minLength={5}
                name="phone"
                placeholder="+7 999 000-00-01"
                required
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
                placeholder="test@example.com"
                type="email"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                День рождения
              </span>
              <input
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                name="birthday"
                type="date"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Заметки
              </span>
              <textarea
                className="mt-2 min-h-28 w-full resize-y rounded-[24px] border border-taupe/25 bg-porcelain/70 px-5 py-4 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                maxLength={1000}
                name="notes"
                placeholder="Внутренняя заметка администратора"
              />
            </label>

            <ClientSubmitButton
              idleText="Добавить клиента"
              pendingText="Добавляем..."
            />
          </form>
        </article>

        <article className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
                база клиентов
              </p>
              <h2 className="font-display text-2xl leading-tight">
                Список клиентов
              </h2>
            </div>
            <StatusBadge tone={clients.length > 0 ? "live" : "preview"}>
              {clients.length} всего
            </StatusBadge>
          </div>

          {clients.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-taupe/35 bg-porcelain/60 p-6">
              <h3 className="font-display text-2xl">Клиентов пока нет</h3>
              <p className="mt-2 text-sm leading-6 text-graphite/62">
                Добавьте первого клиента вручную. Позже сюда будут попадать
                клиенты из онлайн-записи.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-[24px] border border-taupe/25">
              <div className="hidden grid-cols-[1.2fr_1fr_1fr_0.9fr] gap-3 border-b border-taupe/20 bg-porcelain/70 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-plum/45 md:grid">
                <span>Клиент</span>
                <span>Контакт</span>
                <span>Заметка</span>
                <span>Добавлен</span>
              </div>
              {clients.map((client) => {
                const notesPreview = getNotesPreview(client.notes);

                return (
                  <div
                    className="grid gap-3 border-b border-taupe/20 bg-white/55 p-4 last:border-b-0 md:grid-cols-[1.2fr_1fr_1fr_0.9fr]"
                    key={client.id}
                  >
                    <div className="min-w-0">
                      <Link
                        className="block truncate font-semibold text-plum transition hover:text-graphite"
                        href={`/admin/clients/${client.id}`}
                      >
                        {client.full_name}
                      </Link>
                      {client.birthday ? (
                        <p className="mt-1 text-xs text-graphite/55">
                          День рождения: {formatDate(client.birthday)}
                        </p>
                      ) : null}
                    </div>
                    <div className="min-w-0 text-sm text-graphite/65">
                      <p className="truncate">{client.phone}</p>
                      {client.email ? (
                        <p className="mt-1 truncate text-xs">{client.email}</p>
                      ) : null}
                    </div>
                    <p className="min-w-0 text-sm leading-6 text-graphite/60">
                      {notesPreview ?? "Нет заметки"}
                    </p>
                    <p className="text-sm text-graphite/60">
                      {formatDate(client.created_at)}
                    </p>
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
