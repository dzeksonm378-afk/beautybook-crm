import { getAdminContext } from "@/lib/admin/context";
import { getCurrentMonthRange, getTodayDateString } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentStatus } from "@/lib/validations/appointment.schema";

type CountResult = {
  count: number | null;
  error: unknown;
};

type AppointmentCountRow = {
  id: string;
  date: string;
  status: AppointmentStatus;
  price: number | string;
  service_id: string;
};

type UpcomingAppointmentRow = {
  id: string;
  client_id: string;
  service_id: string;
  master_id: string;
  date: string;
  start_time: string;
  end_time: string;
  price: number | string;
};

export type DashboardStats = {
  totalClients: number;
  totalServices: number;
  activeServices: number;
  totalMasters: number;
  activeMasters: number;
  appointmentsToday: number;
  scheduledToday: number;
  completedToday: number;
  cancelledToday: number;
  noShowToday: number;
  revenueThisMonth: number;
  upcomingAppointments: Array<{
    id: string;
    clientId: string;
    date: string;
    start_time: string;
    end_time: string;
    clientName: string;
    serviceTitle: string;
    masterName: string;
    price: number;
  }>;
  popularServices: Array<{
    serviceId: string;
    title: string;
    count: number;
    revenue: number;
  }>;
  appointmentStatusBreakdown: Record<AppointmentStatus, number>;
};

export type DashboardStatsResult =
  | {
      status: "ready";
      stats: DashboardStats;
      today: string;
      monthRange: {
        start: string;
        end: string;
      };
    }
  | {
      status: "not_ready";
      stats: DashboardStats;
      today: string;
      monthRange: {
        start: string;
        end: string;
      };
      reason: "unauthenticated" | "profileMissing" | "salonMissing";
    }
  | {
      status: "error";
      stats: DashboardStats;
      today: string;
      monthRange: {
        start: string;
        end: string;
      };
    };

const emptyStats: DashboardStats = {
  totalClients: 0,
  totalServices: 0,
  activeServices: 0,
  totalMasters: 0,
  activeMasters: 0,
  appointmentsToday: 0,
  scheduledToday: 0,
  completedToday: 0,
  cancelledToday: 0,
  noShowToday: 0,
  revenueThisMonth: 0,
  upcomingAppointments: [],
  popularServices: [],
  appointmentStatusBreakdown: {
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    no_show: 0,
  },
};

function getCount(result: CountResult) {
  return result.count ?? 0;
}

function toNumber(value: number | string) {
  const parsedValue = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function hasCountError(results: CountResult[]) {
  return results.some((result) => Boolean(result.error));
}

function uniqueValues(values: string[]) {
  return [...new Set(values)];
}

function isDateInRange(date: string, start: string, end: string) {
  return date >= start && date <= end;
}

export async function getDashboardStats(): Promise<DashboardStatsResult> {
  const today = getTodayDateString();
  const monthRange = getCurrentMonthRange();
  const adminContext = await getAdminContext();

  if (adminContext.status !== "ready") {
    return {
      status: "not_ready",
      stats: emptyStats,
      today,
      monthRange,
      reason: adminContext.status,
    };
  }

  const supabase = await createClient();
  const salonId = adminContext.salon.id;

  const [
    totalClientsResult,
    totalServicesResult,
    activeServicesResult,
    totalMastersResult,
    activeMastersResult,
    appointmentsTodayResult,
    scheduledTodayResult,
    completedTodayResult,
    cancelledTodayResult,
    noShowTodayResult,
    appointmentsForStatsResult,
    upcomingResult,
  ] = await Promise.all([
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("salon_id", salonId),
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("salon_id", salonId),
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("salon_id", salonId)
      .eq("is_active", true),
    supabase
      .from("masters")
      .select("id", { count: "exact", head: true })
      .eq("salon_id", salonId),
    supabase
      .from("masters")
      .select("id", { count: "exact", head: true })
      .eq("salon_id", salonId)
      .eq("is_active", true),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("salon_id", salonId)
      .eq("date", today),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("salon_id", salonId)
      .eq("date", today)
      .eq("status", "scheduled"),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("salon_id", salonId)
      .eq("date", today)
      .eq("status", "completed"),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("salon_id", salonId)
      .eq("date", today)
      .eq("status", "cancelled"),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("salon_id", salonId)
      .eq("date", today)
      .eq("status", "no_show"),
    supabase
      .from("appointments")
      .select("id, date, service_id, price, status")
      .eq("salon_id", salonId)
      .order("date", { ascending: false }),
    supabase
      .from("appointments")
      .select("id, client_id, service_id, master_id, date, start_time, end_time, price")
      .eq("salon_id", salonId)
      .eq("status", "scheduled")
      .gte("date", today)
      .order("date", { ascending: true })
      .order("start_time", { ascending: true })
      .limit(5),
  ]);

  const countResults = [
    totalClientsResult,
    totalServicesResult,
    activeServicesResult,
    totalMastersResult,
    activeMastersResult,
    appointmentsTodayResult,
    scheduledTodayResult,
    completedTodayResult,
    cancelledTodayResult,
    noShowTodayResult,
  ];

  if (
    hasCountError(countResults)
    || appointmentsForStatsResult.error
    || upcomingResult.error
  ) {
    return {
      status: "error",
      stats: emptyStats,
      today,
      monthRange,
    };
  }

  const appointmentsForStats =
    (appointmentsForStatsResult.data ?? []) as AppointmentCountRow[];
  const monthlyCompletedAppointments = appointmentsForStats.filter(
    (appointment) =>
      appointment.status === "completed"
      && isDateInRange(appointment.date, monthRange.start, monthRange.end),
  );
  const upcomingRows = (upcomingResult.data ?? []) as UpcomingAppointmentRow[];
  const relationClientIds = uniqueValues(upcomingRows.map((row) => row.client_id));
  const relationServiceIds = uniqueValues([
    ...upcomingRows.map((row) => row.service_id),
    ...monthlyCompletedAppointments.map((row) => row.service_id),
  ]);
  const relationMasterIds = uniqueValues(upcomingRows.map((row) => row.master_id));

  const [clientsResult, servicesResult, mastersResult] = await Promise.all([
    relationClientIds.length > 0
      ? supabase
          .from("clients")
          .select("id, full_name")
          .eq("salon_id", salonId)
          .in("id", relationClientIds)
      : Promise.resolve({ data: [], error: null }),
    relationServiceIds.length > 0
      ? supabase
          .from("services")
          .select("id, title")
          .eq("salon_id", salonId)
          .in("id", relationServiceIds)
      : Promise.resolve({ data: [], error: null }),
    relationMasterIds.length > 0
      ? supabase
          .from("masters")
          .select("id, full_name")
          .eq("salon_id", salonId)
          .in("id", relationMasterIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (clientsResult.error || servicesResult.error || mastersResult.error) {
    return {
      status: "error",
      stats: emptyStats,
      today,
      monthRange,
    };
  }

  const clientsById = new Map(
    (clientsResult.data ?? []).map((client) => [client.id, client]),
  );
  const servicesById = new Map(
    (servicesResult.data ?? []).map((service) => [service.id, service]),
  );
  const mastersById = new Map(
    (mastersResult.data ?? []).map((master) => [master.id, master]),
  );
  const appointmentStatusBreakdown = { ...emptyStats.appointmentStatusBreakdown };

  appointmentsForStats.forEach((row) => {
    appointmentStatusBreakdown[row.status] += 1;
  });

  const revenueThisMonth = monthlyCompletedAppointments.reduce(
    (total, appointment) => total + toNumber(appointment.price),
    0,
  );
  const serviceStats = new Map<string, { count: number; revenue: number }>();

  monthlyCompletedAppointments.forEach((appointment) => {
    const currentStats = serviceStats.get(appointment.service_id) ?? {
      count: 0,
      revenue: 0,
    };

    serviceStats.set(appointment.service_id, {
      count: currentStats.count + 1,
      revenue: currentStats.revenue + toNumber(appointment.price),
    });
  });

  const popularServices = [...serviceStats.entries()]
    .map(([serviceId, stats]) => ({
      serviceId,
      title: servicesById.get(serviceId)?.title ?? "Услуга не найдена",
      ...stats,
    }))
    .sort((a, b) => b.count - a.count || b.revenue - a.revenue)
    .slice(0, 5);

  return {
    status: "ready",
    today,
    monthRange,
    stats: {
      totalClients: getCount(totalClientsResult),
      totalServices: getCount(totalServicesResult),
      activeServices: getCount(activeServicesResult),
      totalMasters: getCount(totalMastersResult),
      activeMasters: getCount(activeMastersResult),
      appointmentsToday: getCount(appointmentsTodayResult),
      scheduledToday: getCount(scheduledTodayResult),
      completedToday: getCount(completedTodayResult),
      cancelledToday: getCount(cancelledTodayResult),
      noShowToday: getCount(noShowTodayResult),
      revenueThisMonth,
      appointmentStatusBreakdown,
      popularServices,
      upcomingAppointments: upcomingRows.map((appointment) => ({
        id: appointment.id,
        clientId: appointment.client_id,
        date: appointment.date,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        price: toNumber(appointment.price),
        clientName:
          clientsById.get(appointment.client_id)?.full_name ?? "Клиент не найден",
        serviceTitle:
          servicesById.get(appointment.service_id)?.title ?? "Услуга не найдена",
        masterName:
          mastersById.get(appointment.master_id)?.full_name ?? "Мастер не найден",
      })),
    },
  };
}
