import Link from "next/link";

import { AdminForbiddenState } from "@/components/admin/AdminAccessState";
import { AppointmentSubmitButton } from "@/components/appointments/AppointmentSubmitButton";
import { getAdminPageAccess } from "@/lib/admin/guards";
import {
  createAppointmentAction,
  updateAppointmentAction,
  updateAppointmentStatusAction,
} from "@/lib/appointments/actions";
import {
  getAppointmentFormOptions,
  getAppointments,
} from "@/lib/appointments/queries";
import { formatAppointmentStatus } from "@/lib/appointments/utils";
import {
  appointmentStatuses,
  type AppointmentStatus,
} from "@/lib/validations/appointment.schema";
import { getMaxBookingDateString, getTodayDateString } from "@/lib/date";

const errorMessages: Record<string, string> = {
  access: "CRM-контекст не готов. Проверьте профиль сотрудника и салон.",
  create_failed: "Не удалось создать запись. Попробуйте ещё раз.",
  date_out_of_range:
    "Дата записи должна быть от сегодняшнего дня до 12 месяцев вперёд.",
  edit_not_allowed: "Редактировать можно только запланированные записи.",
  forbidden: "Недостаточно прав для этого действия.",
  inactive_option: "Выбранная услуга или мастер больше не активны.",
  invalid_time: "Проверьте время начала записи.",
  missing_options: "Проверьте клиента, активную услугу и активного мастера.",
  not_found: "Запись не найдена или недоступна.",
  outside_working_hours: "Выбранное время выходит за рабочие часы салона.",
  time_conflict: "У мастера уже есть запись на это время.",
  update_failed: "Не удалось обновить запись. Попробуйте ещё раз.",
  validation: "Проверьте клиента, услугу, мастера, дату и время.",
};

const statusClassName: Record<AppointmentStatus, string> = {
  scheduled: "border-lime/50 bg-lime/30 text-graphite",
  completed: "border-taupe/45 bg-taupe/20 text-graphite",
  cancelled: "border-[#B86B6B]/35 bg-[#B86B6B]/18 text-[#7A2E2E]",
  no_show: "border-[#6D3434]/35 bg-[#6D3434]/18 text-[#6D3434]",
};

type AdminAppointmentsPageProps = {
  searchParams?: Promise<{
    clientId?: string;
    created?: string;
    date?: string;
    error?: string;
    masterId?: string;
    status?: string;
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

  if (compactComment.length <= 90) {
    return compactComment;
  }

  return `${compactComment.slice(0, 90)}...`;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export default async function AdminAppointmentsPage({
  searchParams,
}: AdminAppointmentsPageProps) {
  const params = await searchParams;
  const access = await getAdminPageAccess("manageAppointments");

  if (access.status !== "ready") {
    return <AdminForbiddenState />;
  }

  const today = getTodayDateString();
  const maxBookingDate = getMaxBookingDateString();
  const date = params?.date?.trim() ?? "";
  const masterId = params?.masterId?.trim() ?? "";
  const status = params?.status?.trim() ?? "";
  const requestedClientId = params?.clientId?.trim() ?? "";
  const [appointmentsResult, optionsResult] = await Promise.all([
    getAppointments({ clientId: requestedClientId, date, masterId, status }),
    getAppointmentFormOptions(),
  ]);
  const appointments = appointmentsResult.appointments;
  const options = optionsResult.options;
  const created = params?.created === "1";
  const updated = params?.updated === "1";
  const errorMessage = params?.error ? errorMessages[params.error] : null;
  const hasFilters =
    appointmentsResult.filters.clientId ||
    appointmentsResult.filters.date ||
    appointmentsResult.filters.masterId ||
    appointmentsResult.filters.status;
  const hasAllOptions =
    options.clients.length > 0
    && options.services.length > 0
    && options.masters.length > 0;
  const requestedClientIdIsValid = requestedClientId
    ? isUuid(requestedClientId)
    : false;
  const selectedClientId =
    optionsResult.status === "ready"
    && requestedClientIdIsValid
    && options.clients.some((client) => client.id === requestedClientId)
      ? requestedClientId
      : "";
  const hasUnavailableRequestedClient =
    Boolean(requestedClientId)
    && (!requestedClientIdIsValid
      || (optionsResult.status === "ready" && !selectedClientId));

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-champagne/35 bg-champagne/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-champagne">
                данные CRM
              </span>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-plum/10 bg-plum/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-plum">
                проверка конфликтов
              </span>
            </div>
            <h1 className="font-display text-3xl leading-tight">Записи</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-graphite/62">
              Расписание и статусы визитов текущего салона. Цена и длительность
              подтягиваются из выбранной услуги на сервере.
            </p>
            <Link
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full border border-taupe/35 px-4 text-sm font-bold text-plum transition hover:border-champagne hover:text-graphite sm:w-auto"
              href="/admin/clients"
            >
              Клиенты
            </Link>
          </div>

          <form
            action="/admin/appointments"
            className="grid w-full gap-3 sm:grid-cols-2 xl:max-w-4xl xl:grid-cols-[170px_1fr_190px_auto_auto]"
            method="get"
          >
            {appointmentsResult.filters.clientId ? (
              <input
                name="clientId"
                type="hidden"
                value={appointmentsResult.filters.clientId}
              />
            ) : null}
            <label>
              <span className="sr-only">Дата</span>
              <input
                className="h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                defaultValue={appointmentsResult.filters.date}
                name="date"
                type="date"
              />
            </label>
            <label>
              <span className="sr-only">Мастер</span>
              <select
                className="h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                defaultValue={appointmentsResult.filters.masterId}
                name="masterId"
              >
                <option value="">Все мастера</option>
                {options.masters.map((master) => (
                  <option key={master.id} value={master.id}>
                    {master.full_name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Статус</span>
              <select
                className="h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                defaultValue={appointmentsResult.filters.status}
                name="status"
              >
                <option value="">Все статусы</option>
                {appointmentStatuses.map((item) => (
                  <option key={item} value={item}>
                    {formatAppointmentStatus(item)}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="h-12 w-full rounded-full border border-graphite bg-graphite px-5 text-sm font-bold text-porcelain transition hover:bg-plum"
              type="submit"
            >
              Применить
            </button>
            {hasFilters ? (
              <Link
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-taupe/35 px-5 text-sm font-bold text-plum transition hover:border-champagne hover:text-graphite"
                href="/admin/appointments"
              >
                Сбросить
              </Link>
            ) : null}
          </form>
        </div>

        {created ? (
          <p className="mt-5 rounded-[20px] border border-lime/25 bg-lime/10 px-4 py-3 text-sm font-semibold text-graphite">
            Запись создана.
          </p>
        ) : null}

        {updated ? (
          <p className="mt-5 rounded-[20px] border border-lime/25 bg-lime/10 px-4 py-3 text-sm font-semibold text-graphite">
            Запись обновлена.
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
            {errorMessage}
          </p>
        ) : null}

        {!hasAllOptions ? (
          <p className="mt-5 rounded-[20px] border border-champagne/25 bg-champagne/10 px-4 py-3 text-sm font-semibold text-graphite">
            Для создания записи нужен хотя бы один клиент, активная услуга и
            активный мастер.
          </p>
        ) : null}

        {selectedClientId ? (
          <p className="mt-5 rounded-[20px] border border-lime/25 bg-lime/10 px-4 py-3 text-sm font-semibold text-graphite">
            Клиент выбран из карточки. Можно выбрать другого клиента вручную.
          </p>
        ) : null}

        {hasUnavailableRequestedClient ? (
          <p className="mt-5 rounded-[20px] border border-champagne/25 bg-champagne/10 px-4 py-3 text-sm font-semibold text-graphite">
            Клиент из ссылки не найден или недоступен.
          </p>
        ) : null}

        {appointmentsResult.status === "error" || optionsResult.status === "error" ? (
          <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
            Не удалось загрузить данные записей. Попробуйте обновить страницу.
          </p>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
            новая запись
          </p>
          <h2 className="font-display text-2xl leading-tight">Новая запись</h2>
          <p className="mt-2 text-sm leading-6 text-graphite/62">
            Цена и длительность подтянутся из выбранной услуги. Конфликт времени
            проверяется для запланированных записей того же мастера.
          </p>
          <p className="mt-3 rounded-[20px] border border-champagne/25 bg-champagne/10 px-4 py-3 text-sm leading-6 text-graphite/70">
            Запись должна попадать в рабочие часы салона. По умолчанию: пн-пт
            10:00-20:00, сб 10:00-18:00, вс закрыто. Записи можно создавать на
            период до 12 месяцев вперёд.
          </p>

          <form action={createAppointmentAction} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Клиент
              </span>
              <select
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                defaultValue={selectedClientId}
                disabled={options.clients.length === 0}
                name="clientId"
                required
              >
                <option value="">Выберите клиента</option>
                {options.clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.full_name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Услуга
              </span>
              <select
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                disabled={options.services.length === 0}
                name="serviceId"
                required
              >
                <option value="">Выберите услугу</option>
                {options.services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title} · {service.duration_minutes} мин ·{" "}
                    {formatPrice(service.price)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Мастер
              </span>
              <select
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                disabled={options.masters.length === 0}
                name="masterId"
                required
              >
                <option value="">Выберите мастера</option>
                {options.masters.map((master) => (
                  <option key={master.id} value={master.id}>
                    {master.full_name}
                    {master.specialization ? ` · ${master.specialization}` : ""}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                  Дата
                </span>
                <input
                  className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                  max={maxBookingDate}
                  min={today}
                  name="date"
                  required
                  type="date"
                />
                <span className="mt-2 block text-xs leading-5 text-graphite/50">
                  От {formatDate(today)} до {formatDate(maxBookingDate)}.
                </span>
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                  Время начала
                </span>
                <input
                  className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                  name="startTime"
                  required
                  step={300}
                  type="time"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Комментарий
              </span>
              <textarea
                className="mt-2 min-h-28 w-full resize-y rounded-[24px] border border-taupe/25 bg-porcelain/70 px-5 py-4 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                maxLength={1000}
                name="comment"
                placeholder="Комментарий для администратора"
              />
            </label>

            <AppointmentSubmitButton
              idleText="Создать запись"
              pendingText="Создаём..."
            />
          </form>
        </article>

        <article className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
                список записей
              </p>
              <h2 className="font-display text-2xl leading-tight">
                Список записей
              </h2>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-plum/10 bg-plum/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-plum">
              {appointments.length} всего
            </span>
          </div>

          {appointments.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-taupe/35 bg-porcelain/60 p-6">
              <h3 className="font-display text-2xl">Записей пока нет</h3>
              <p className="mt-2 text-sm leading-6 text-graphite/62">
                Создайте первую запись, выбрав клиента, услугу, мастера, дату и
                время.
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
                    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="break-words font-semibold">
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
                          {appointment.client ? (
                            <Link
                              className="font-semibold text-plum transition hover:text-graphite"
                              href={`/admin/clients/${appointment.client_id}`}
                            >
                              {appointment.client.full_name}
                            </Link>
                          ) : (
                            "Клиент не найден"
                          )}{" "}
                          ·{" "}
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

                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                        {appointment.client ? (
                          <Link
                            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-taupe/35 px-4 text-center text-sm font-bold text-plum transition hover:border-champagne hover:text-graphite"
                            href={`/admin/clients/${appointment.client_id}`}
                          >
                            Открыть клиента
                          </Link>
                        ) : null}
                        {appointmentStatuses.map((item) => (
                          <form action={updateAppointmentStatusAction} key={item}>
                            <input
                              name="appointmentId"
                              type="hidden"
                              value={appointment.id}
                            />
                            <input name="status" type="hidden" value={item} />
                            <AppointmentSubmitButton
                              idleText={formatAppointmentStatus(item)}
                              pendingText="Обновляем..."
                              variant="secondary"
                            />
                          </form>
                        ))}
                      </div>
                    </div>

                    {appointment.status === "scheduled" ? (
                      <div className="mt-5 rounded-[22px] border border-taupe/20 bg-porcelain/55 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
                          редактирование записи
                        </p>
                        <h4 className="mt-2 font-display text-xl leading-tight">
                          Редактировать запись
                        </h4>
                        <form
                          action={updateAppointmentAction}
                          className="mt-4 grid gap-4 lg:grid-cols-2"
                        >
                          <input
                            name="appointmentId"
                            type="hidden"
                            value={appointment.id}
                          />

                          <label className="block">
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                              Клиент
                            </span>
                            <select
                              className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-white/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                              defaultValue={appointment.client_id}
                              name="clientId"
                              required
                            >
                              <option value="">Выберите клиента</option>
                              {options.clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                  {client.full_name}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="block">
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                              Услуга
                            </span>
                            <span className="mt-1 block text-xs text-graphite/50">
                              Текущая:{" "}
                              {appointment.service?.title ?? "Услуга не найдена"}
                            </span>
                            <select
                              className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-white/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                              defaultValue={
                                options.services.some(
                                  (service) => service.id === appointment.service_id,
                                )
                                  ? appointment.service_id
                                  : ""
                              }
                              name="serviceId"
                              required
                            >
                              <option value="">Выберите активную услугу</option>
                              {options.services.map((service) => (
                                <option key={service.id} value={service.id}>
                                  {service.title} · {service.duration_minutes} мин ·{" "}
                                  {formatPrice(service.price)}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="block">
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                              Мастер
                            </span>
                            <span className="mt-1 block text-xs text-graphite/50">
                              Текущий:{" "}
                              {appointment.master?.full_name ?? "Мастер не найден"}
                            </span>
                            <select
                              className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-white/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                              defaultValue={
                                options.masters.some(
                                  (master) => master.id === appointment.master_id,
                                )
                                  ? appointment.master_id
                                  : ""
                              }
                              name="masterId"
                              required
                            >
                              <option value="">Выберите активного мастера</option>
                              {options.masters.map((master) => (
                                <option key={master.id} value={master.id}>
                                  {master.full_name}
                                  {master.specialization
                                    ? ` · ${master.specialization}`
                                    : ""}
                                </option>
                              ))}
                            </select>
                          </label>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block">
                              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                                Дата
                              </span>
                              <input
                                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-white/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                                defaultValue={appointment.date}
                                max={maxBookingDate}
                                min={today}
                                name="date"
                                required
                                type="date"
                              />
                            </label>

                            <label className="block">
                              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                                Время
                              </span>
                              <input
                                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-white/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                                defaultValue={formatTime(appointment.start_time)}
                                name="startTime"
                                required
                                step={300}
                                type="time"
                              />
                            </label>
                          </div>

                          <label className="block lg:col-span-2">
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                              Комментарий
                            </span>
                            <textarea
                              className="mt-2 min-h-24 w-full resize-y rounded-[22px] border border-taupe/25 bg-white/70 px-5 py-4 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                              defaultValue={appointment.comment ?? ""}
                              maxLength={1000}
                              name="comment"
                            />
                          </label>

                          <AppointmentSubmitButton
                            idleText="Сохранить изменения"
                            pendingText="Сохраняем..."
                          />
                        </form>
                      </div>
                    ) : (
                      <p className="mt-5 rounded-[20px] border border-champagne/25 bg-champagne/10 px-4 py-3 text-sm leading-6 text-graphite/70">
                        Редактирование доступно для запланированных записей.
                        Завершённые и отменённые записи лучше не менять, чтобы не
                        ломать историю.
                      </p>
                    )}
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
