import Link from "next/link";

import { AdminForbiddenState } from "@/components/admin/AdminAccessState";
import { ClientSubmitButton } from "@/components/clients/ClientSubmitButton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getAdminPageAccess } from "@/lib/admin/guards";
import { updateClientAction } from "@/lib/clients/actions";
import { getClientDetails } from "@/lib/clients/queries";
import { formatAppointmentStatus } from "@/lib/appointments/utils";
import type { AppointmentStatus } from "@/lib/validations/appointment.schema";

const errorMessages: Record<string, string> = {
  access: "CRM-контекст не готов. Проверьте профиль сотрудника и салон.",
  duplicate_phone: "Клиент с таким телефоном уже есть в этом салоне.",
  forbidden: "Недостаточно прав для этого действия.",
  not_found: "Клиент не найден в текущем салоне.",
  update_failed: "Не удалось обновить клиента. Попробуйте ещё раз.",
  validation: "Проверьте имя и телефон клиента.",
};

const statusClassName: Record<AppointmentStatus, string> = {
  scheduled: "border-lime/50 bg-lime/30 text-graphite",
  completed: "border-taupe/45 bg-taupe/20 text-graphite",
  cancelled: "border-[#B86B6B]/35 bg-[#B86B6B]/18 text-[#7A2E2E]",
  no_show: "border-[#6D3434]/35 bg-[#6D3434]/18 text-[#6D3434]",
};

type AdminClientDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
    updated?: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    timeZone: "Europe/Moscow",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00+03:00`));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    timeZone: "Europe/Moscow",
    year: "numeric",
  }).format(new Date(value));
}

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

function formatTime(value: string) {
  return value.slice(0, 5);
}

function getCommentPreview(comment: string | null) {
  if (!comment) {
    return null;
  }

  const compactComment = comment.trim().replace(/\s+/g, " ");

  if (compactComment.length <= 110) {
    return compactComment;
  }

  return `${compactComment.slice(0, 110)}...`;
}

function getSafeErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error] ?? errorMessages.update_failed;
}

export default async function AdminClientDetailPage({
  params,
  searchParams,
}: AdminClientDetailPageProps) {
  const [{ id }, queryParams, access] = await Promise.all([
    params,
    searchParams,
    getAdminPageAccess("manageClients"),
  ]);

  if (access.status !== "ready") {
    return <AdminForbiddenState />;
  }

  const detailsResult = await getClientDetails(id);
  const errorMessage = getSafeErrorMessage(queryParams?.error);
  const updated = queryParams?.updated === "1";

  if (detailsResult.status !== "ready") {
    const title =
      detailsResult.status === "not_found"
        ? "Клиент не найден"
        : "Карточка клиента недоступна";
    const description =
      detailsResult.status === "not_ready"
        ? "CRM-контекст не готов. Клиентские данные не загружены."
        : "Данные клиента не раскрыты. Проверьте ссылку или вернитесь к списку клиентов.";

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-full border border-taupe/35 px-4 text-sm font-bold text-plum transition hover:border-champagne hover:text-graphite"
            href="/admin/clients"
          >
            ← Клиенты
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-full border border-taupe/35 px-4 text-sm font-bold text-plum transition hover:border-champagne hover:text-graphite"
            href="/admin/appointments"
          >
            Создать запись
          </Link>
        </div>

        <section className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <StatusBadge tone="gold">данные CRM</StatusBadge>
            <StatusBadge tone="preview">текущий салон</StatusBadge>
          </div>
          <h1 className="font-display text-3xl leading-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-graphite/62">
            {description}
          </p>
          {errorMessage ? (
            <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
              {errorMessage}
            </p>
          ) : null}
        </section>
      </div>
    );
  }

  const { client, appointments, stats } = detailsResult;
  const nextScheduledAppointment = stats.nextScheduledAppointment;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link
          className="inline-flex h-10 items-center justify-center rounded-full border border-taupe/35 px-4 text-sm font-bold text-plum transition hover:border-champagne hover:text-graphite"
          href="/admin/clients"
        >
          ← Клиенты
        </Link>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-full border border-taupe/35 px-4 text-sm font-bold text-plum transition hover:border-champagne hover:text-graphite"
          href={`/admin/appointments?clientId=${client.id}`}
        >
          Создать запись
        </Link>
      </div>

      <section className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <StatusBadge tone="gold">данные CRM</StatusBadge>
              <StatusBadge tone="preview">текущий салон</StatusBadge>
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
              Карточка клиента
            </p>
            <h1 className="break-words font-display text-3xl leading-tight">
              {client.full_name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-graphite/62">
              Данные клиента, история визитов и базовая статистика только для
              текущего салона.
            </p>
          </div>

          {nextScheduledAppointment ? (
            <div className="rounded-[24px] border border-lime/25 bg-lime/10 px-5 py-4 text-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-plum/45">
                Следующая запись
              </p>
              <p className="mt-1 font-semibold">
                {formatDate(nextScheduledAppointment.date)} ·{" "}
                {formatTime(nextScheduledAppointment.start_time)}
              </p>
            </div>
          ) : null}
        </div>

        {updated ? (
          <p className="mt-5 rounded-[20px] border border-lime/25 bg-lime/10 px-4 py-3 text-sm font-semibold text-graphite">
            Данные клиента обновлены.
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
            {errorMessage}
          </p>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
            данные клиента
          </p>
          <h2 className="font-display text-2xl leading-tight">Данные клиента</h2>

          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-plum/45">
                Имя
              </dt>
              <dd className="mt-1 break-words font-semibold">{client.full_name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-plum/45">
                Телефон
              </dt>
              <dd className="mt-1 break-words font-semibold">{client.phone}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-plum/45">
                Email
              </dt>
              <dd className="mt-1 break-words font-semibold">
                {client.email ?? "Не указан"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-plum/45">
                День рождения
              </dt>
              <dd className="mt-1 font-semibold">
                {client.birthday ? formatDate(client.birthday) : "Не указан"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-plum/45">
                Создан
              </dt>
              <dd className="mt-1 font-semibold">
                {formatDateTime(client.created_at)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-plum/45">
                Обновлён
              </dt>
              <dd className="mt-1 font-semibold">
                {formatDateTime(client.updated_at)}
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-[24px] border border-taupe/25 bg-porcelain/60 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-plum/45">
              Заметки
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-graphite/70">
              {client.notes ?? "Заметки не добавлены"}
            </p>
          </div>
        </article>

        <article className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
            статистика клиента
          </p>
          <h2 className="font-display text-2xl leading-tight">
            Статистика клиента
          </h2>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] border border-taupe/25 bg-white/55 p-4">
              <dt className="text-xs uppercase tracking-[0.16em] text-plum/45">
                Всего записей
              </dt>
              <dd className="mt-2 font-display text-3xl">
                {stats.totalAppointments}
              </dd>
            </div>
            <div className="rounded-[22px] border border-taupe/25 bg-white/55 p-4">
              <dt className="text-xs uppercase tracking-[0.16em] text-plum/45">
                Завершённых визитов
              </dt>
              <dd className="mt-2 font-display text-3xl">
                {stats.completedAppointments}
              </dd>
            </div>
            <div className="rounded-[22px] border border-taupe/25 bg-white/55 p-4">
              <dt className="text-xs uppercase tracking-[0.16em] text-plum/45">
                Отмен
              </dt>
              <dd className="mt-2 font-display text-3xl">
                {stats.cancelledAppointments}
              </dd>
            </div>
            <div className="rounded-[22px] border border-taupe/25 bg-white/55 p-4">
              <dt className="text-xs uppercase tracking-[0.16em] text-plum/45">
                Неявки
              </dt>
              <dd className="mt-2 font-display text-3xl">
                {stats.noShowAppointments}
              </dd>
            </div>
            <div className="rounded-[22px] border border-taupe/25 bg-white/55 p-4">
              <dt className="text-xs uppercase tracking-[0.16em] text-plum/45">
                Потрачено всего
              </dt>
              <dd className="mt-2 font-display text-3xl">
                {formatPrice(stats.totalRevenue)}
              </dd>
            </div>
            <div className="rounded-[22px] border border-taupe/25 bg-white/55 p-4">
              <dt className="text-xs uppercase tracking-[0.16em] text-plum/45">
                Последний визит
              </dt>
              <dd className="mt-2 font-display text-2xl">
                {stats.lastVisitDate ? formatDate(stats.lastVisitDate) : "Нет"}
              </dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
            edit client
          </p>
          <h2 className="font-display text-2xl leading-tight">
            Редактировать клиента
          </h2>

          <form action={updateClientAction} className="mt-6 space-y-4">
            <input name="clientId" type="hidden" value={client.id} />

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Имя
              </span>
              <input
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                defaultValue={client.full_name}
                maxLength={120}
                minLength={2}
                name="fullName"
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
                defaultValue={client.phone}
                maxLength={30}
                minLength={5}
                name="phone"
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
                defaultValue={client.email ?? ""}
                name="email"
                type="email"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                День рождения
              </span>
              <input
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                defaultValue={client.birthday ?? ""}
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
                defaultValue={client.notes ?? ""}
                maxLength={1000}
                name="notes"
              />
            </label>

            <ClientSubmitButton
              idleText="Сохранить изменения"
              pendingText="Сохраняем..."
            />
          </form>
        </article>

        <article className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
                история визитов
              </p>
              <h2 className="font-display text-2xl leading-tight">
                История визитов
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone={appointments.length > 0 ? "live" : "preview"}>
                {appointments.length} всего
              </StatusBadge>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-full border border-taupe/35 px-4 text-sm font-bold text-plum transition hover:border-champagne hover:text-graphite"
                href={`/admin/appointments?clientId=${client.id}`}
              >
                Все записи
              </Link>
            </div>
          </div>

          {appointments.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-taupe/35 bg-porcelain/60 p-6">
              <h3 className="font-display text-2xl">
                Истории визитов пока нет
              </h3>
              <p className="mt-2 text-sm leading-6 text-graphite/62">
                Записи клиента появятся здесь после первого визита.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {appointments.map((appointment) => {
                const commentPreview = getCommentPreview(appointment.comment);

                return (
                  <div
                    className="rounded-[24px] border border-taupe/25 bg-white/60 p-4"
                    key={appointment.id}
                  >
                    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr_auto] lg:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {formatDate(appointment.date)} ·{" "}
                            {formatTime(appointment.start_time)}-
                            {formatTime(appointment.end_time)}
                          </h3>
                          <span
                            className={`w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${statusClassName[appointment.status]}`}
                          >
                            {formatAppointmentStatus(appointment.status)}
                          </span>
                        </div>
                        <p className="mt-2 break-words text-sm leading-6 text-graphite/62">
                          {appointment.service?.title ?? "Услуга не найдена"}
                        </p>
                        {commentPreview ? (
                          <p className="mt-2 break-words text-sm leading-6 text-graphite/56">
                            {commentPreview}
                          </p>
                        ) : null}
                      </div>

                      <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-plum/45">
                            Мастер
                          </p>
                          <p className="mt-1 break-words font-semibold text-graphite/72">
                            {appointment.master?.full_name ?? "Не найден"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-plum/45">
                            Цена
                          </p>
                          <p className="mt-1 font-semibold text-graphite/72">
                            {formatPrice(appointment.price)}
                          </p>
                        </div>
                      </div>
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
