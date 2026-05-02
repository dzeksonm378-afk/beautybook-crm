import Link from "next/link";

import {
  AdminForbiddenState,
  MasterModeState,
} from "@/components/admin/AdminAccessState";
import { formatRuDate, formatShortTime } from "@/lib/date";
import { getDashboardStats } from "@/lib/dashboard/queries";
import { formatAppointmentStatus } from "@/lib/appointments/utils";
import { getAdminPageAccess } from "@/lib/admin/guards";
import type { AppointmentStatus } from "@/lib/validations/appointment.schema";
import { PlaceholderCard } from "@/components/shared/PlaceholderCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: "Запланирована",
  completed: "Завершена",
  cancelled: "Отменена",
  no_show: "Не пришёл",
};

const statusTone: Record<AppointmentStatus, "live" | "taupe" | "danger" | "preview"> = {
  scheduled: "live",
  completed: "taupe",
  cancelled: "danger",
  no_show: "preview",
};

const quickLinks = [
  ["Добавить клиента", "/admin/clients"],
  ["Создать запись", "/admin/appointments"],
  ["Добавить услугу", "/admin/services"],
  ["Добавить мастера", "/admin/masters"],
];

function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    currency: "RUB",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export default async function AdminPage() {
  const access = await getAdminPageAccess("viewDashboard");

  if (access.status === "forbidden") {
    return access.role === "master" ? (
      <MasterModeState />
    ) : (
      <AdminForbiddenState />
    );
  }

  if (access.status !== "ready") {
    return (
      <AdminForbiddenState
        title="CRM-контекст не готов"
        description="Обзор салона не загружен. Проверьте профиль сотрудника и салон."
      />
    );
  }

  const dashboardResult = await getDashboardStats();
  const { stats } = dashboardResult;
  const statCards = [
    ["Клиентов всего", String(stats.totalClients)],
    ["Активных услуг", `${stats.activeServices}/${stats.totalServices}`],
    ["Активных мастеров", `${stats.activeMasters}/${stats.totalMasters}`],
    ["Записей сегодня", String(stats.appointmentsToday)],
    ["Завершено сегодня", String(stats.completedToday)],
    ["Выручка за месяц", formatMoney(stats.revenueThisMonth)],
  ];

  return (
    <div className="space-y-6">
      <PlaceholderCard
        eyebrow="dashboard"
        title="Обзор салона"
        description="Реальные показатели текущего салона из Supabase. Выручка считается только по завершённым записям."
      >
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="gold">данные CRM</StatusBadge>
          <StatusBadge tone="preview">Europe/Moscow</StatusBadge>
          {dashboardResult.status === "error" ? (
            <StatusBadge tone="danger">ошибка данных</StatusBadge>
          ) : null}
        </div>

        {dashboardResult.status === "error" ? (
          <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
            Не удалось загрузить часть показателей. Попробуйте обновить страницу.
          </p>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map(([label, href]) => (
            <Link
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-taupe/35 px-5 text-sm font-bold text-plum transition hover:border-champagne hover:text-graphite"
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </div>
      </PlaceholderCard>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map(([label, value]) => (
          <PlaceholderCard key={label} title={value}>
            <p className="text-sm text-graphite/60">{label}</p>
          </PlaceholderCard>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <PlaceholderCard
          eyebrow="schedule"
          title="Ближайшие записи"
          description="Показываются только запланированные записи, начиная с сегодняшнего дня."
        >
          {stats.upcomingAppointments.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-taupe/35 bg-porcelain/60 p-5">
              <h3 className="font-display text-2xl">Записей пока нет</h3>
              <p className="mt-2 text-sm leading-6 text-graphite/62">
                Создайте первую запись, чтобы ближайшие визиты появились здесь.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.upcomingAppointments.map((appointment) => (
                <div
                  className="rounded-[22px] border border-taupe/20 bg-white/60 p-4"
                  key={appointment.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {formatRuDate(appointment.date)} ·{" "}
                        {formatShortTime(appointment.start_time)}-
                        {formatShortTime(appointment.end_time)}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-graphite/62">
                        <Link
                          className="font-semibold text-plum transition hover:text-graphite"
                          href={`/admin/clients/${appointment.clientId}`}
                        >
                          {appointment.clientName}
                        </Link>{" "}
                        · {appointment.serviceTitle}
                      </p>
                      <p className="text-sm text-graphite/55">
                        Мастер: {appointment.masterName}
                      </p>
                    </div>
                    <StatusBadge tone="live">{formatMoney(appointment.price)}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PlaceholderCard>

        <PlaceholderCard
          eyebrow="services"
          title="Популярные услуги"
          description="Считаются по завершённым записям текущего месяца."
        >
          {stats.popularServices.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-taupe/35 bg-porcelain/60 p-5">
              <h3 className="font-display text-2xl">Данных пока нет</h3>
              <p className="mt-2 text-sm leading-6 text-graphite/62">
                Популярные услуги появятся после первых завершённых визитов.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.popularServices.map((service) => (
                <div
                  className="rounded-[20px] border border-taupe/20 bg-white/60 p-4"
                  key={service.serviceId}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{service.title}</p>
                      <p className="mt-1 text-sm text-graphite/58">
                        {service.count} завершённых записей
                      </p>
                    </div>
                    <StatusBadge tone="gold">{formatMoney(service.revenue)}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PlaceholderCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
        <PlaceholderCard
          eyebrow="statuses"
          title="Статусы записей"
          description="Разбивка по всем записям текущего салона."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(statusLabels) as AppointmentStatus[]).map((status) => (
              <div
                className="rounded-[22px] border border-taupe/20 bg-white/60 p-4"
                key={status}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-graphite/72">
                    {statusLabels[status]}
                  </p>
                  <StatusBadge tone={statusTone[status]}>
                    {stats.appointmentStatusBreakdown[status]}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </PlaceholderCard>

        <PlaceholderCard
          eyebrow="today"
          title="Сегодня"
          description={`${formatRuDate(dashboardResult.today)}. Отмены и неявки не входят в выручку.`}
        >
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-[22px] border border-taupe/20 bg-white/60 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-plum/45">
                Всего
              </p>
              <p className="mt-2 font-display text-3xl">
                {stats.appointmentsToday}
              </p>
            </div>
            {(["scheduled", "completed", "cancelled", "no_show"] as AppointmentStatus[]).map(
              (status) => (
                <div
                  className="rounded-[22px] border border-taupe/20 bg-white/60 p-4"
                  key={status}
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-plum/45">
                    {formatAppointmentStatus(status)}
                  </p>
                  <p className="mt-2 font-display text-3xl">
                    {status === "scheduled"
                      ? stats.scheduledToday
                      : status === "completed"
                        ? stats.completedToday
                        : status === "cancelled"
                          ? stats.cancelledToday
                          : stats.noShowToday}
                  </p>
                </div>
              ),
            )}
          </div>
        </PlaceholderCard>
      </section>
    </div>
  );
}
