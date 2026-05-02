import { getAdminContext } from "@/lib/admin/context";
import { getTodayDateString } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentStatus } from "@/lib/validations/appointment.schema";

export type ClientListItem = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  birthday: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientListResult =
  | {
      status: "ready";
      clients: ClientListItem[];
      query: string;
    }
  | {
      status: "not_ready";
      clients: [];
      query: string;
      reason: "unauthenticated" | "profileMissing" | "salonMissing";
    }
  | {
      status: "error";
      clients: [];
      query: string;
    };

export type ClientAppointmentItem = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  price: number | string;
  comment: string | null;
  service: {
    title: string;
  } | null;
  master: {
    full_name: string;
  } | null;
};

export type ClientStats = {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  totalRevenue: number;
  lastVisitDate: string | null;
  nextScheduledAppointment: ClientAppointmentItem | null;
};

export type ClientDetailsResult =
  | {
      status: "ready";
      client: ClientListItem;
      appointments: ClientAppointmentItem[];
      stats: ClientStats;
    }
  | {
      status: "not_ready";
      client: null;
      appointments: [];
      stats: ClientStats;
      reason: "unauthenticated" | "profileMissing" | "salonMissing";
    }
  | {
      status: "not_found";
      client: null;
      appointments: [];
      stats: ClientStats;
    }
  | {
      status: "error";
      client: null;
      appointments: [];
      stats: ClientStats;
    };

type ClientAppointmentRow = {
  id: string;
  service_id: string;
  master_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  price: number | string;
  comment: string | null;
};

const emptyStats: ClientStats = {
  totalAppointments: 0,
  completedAppointments: 0,
  cancelledAppointments: 0,
  noShowAppointments: 0,
  totalRevenue: 0,
  lastVisitDate: null,
  nextScheduledAppointment: null,
};

function normalizeSearchQuery(query?: string) {
  return (query ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
}

function escapePostgrestSearchValue(value: string) {
  return value.replace(/[%_(),]/g, " ").replace(/\s+/g, " ").trim();
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function uniqueValues(values: string[]) {
  return [...new Set(values)];
}

function toNumber(value: number | string) {
  const parsedValue = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export async function getClients(params?: { q?: string }): Promise<ClientListResult> {
  const searchQuery = normalizeSearchQuery(params?.q);
  const adminContext = await getAdminContext();

  if (adminContext.status !== "ready") {
    return {
      status: "not_ready",
      clients: [],
      query: searchQuery,
      reason: adminContext.status,
    };
  }

  const supabase = await createClient();

  let query = supabase
    .from("clients")
    .select("id, full_name, phone, email, birthday, notes, created_at, updated_at")
    .eq("salon_id", adminContext.salon.id);

  const safeSearchValue = escapePostgrestSearchValue(searchQuery);

  if (safeSearchValue) {
    query = query.or(
      `full_name.ilike.%${safeSearchValue}%,phone.ilike.%${safeSearchValue}%`,
    );
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return {
      status: "error",
      clients: [],
      query: searchQuery,
    };
  }

  return {
    status: "ready",
    clients: data ?? [],
    query: searchQuery,
  };
}

export async function getClientDetails(
  clientId: string,
): Promise<ClientDetailsResult> {
  const normalizedClientId = clientId.trim();
  const adminContext = await getAdminContext();

  if (adminContext.status !== "ready") {
    return {
      status: "not_ready",
      client: null,
      appointments: [],
      stats: emptyStats,
      reason: adminContext.status,
    };
  }

  if (!isUuid(normalizedClientId)) {
    return {
      status: "not_found",
      client: null,
      appointments: [],
      stats: emptyStats,
    };
  }

  const supabase = await createClient();
  const salonId = adminContext.salon.id;

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, full_name, phone, email, birthday, notes, created_at, updated_at")
    .eq("id", normalizedClientId)
    .eq("salon_id", salonId)
    .maybeSingle<ClientListItem>();

  if (clientError) {
    return {
      status: "error",
      client: null,
      appointments: [],
      stats: emptyStats,
    };
  }

  if (!client) {
    return {
      status: "not_found",
      client: null,
      appointments: [],
      stats: emptyStats,
    };
  }

  const { data: appointmentRows, error: appointmentsError } = await supabase
    .from("appointments")
    .select(
      "id, service_id, master_id, date, start_time, end_time, status, price, comment",
    )
    .eq("salon_id", salonId)
    .eq("client_id", client.id)
    .order("date", { ascending: false })
    .order("start_time", { ascending: false });

  if (appointmentsError) {
    return {
      status: "error",
      client: null,
      appointments: [],
      stats: emptyStats,
    };
  }

  const rows = (appointmentRows ?? []) as ClientAppointmentRow[];

  if (rows.length === 0) {
    return {
      status: "ready",
      client,
      appointments: [],
      stats: emptyStats,
    };
  }

  const serviceIds = uniqueValues(rows.map((row) => row.service_id));
  const masterIds = uniqueValues(rows.map((row) => row.master_id));

  const [servicesResult, mastersResult] = await Promise.all([
    supabase
      .from("services")
      .select("id, title")
      .eq("salon_id", salonId)
      .in("id", serviceIds),
    supabase
      .from("masters")
      .select("id, full_name")
      .eq("salon_id", salonId)
      .in("id", masterIds),
  ]);

  if (servicesResult.error || mastersResult.error) {
    return {
      status: "error",
      client: null,
      appointments: [],
      stats: emptyStats,
    };
  }

  const servicesById = new Map(
    (servicesResult.data ?? []).map((service) => [service.id, service]),
  );
  const mastersById = new Map(
    (mastersResult.data ?? []).map((master) => [master.id, master]),
  );
  const appointments = rows.map((row) => ({
    id: row.id,
    date: row.date,
    start_time: row.start_time,
    end_time: row.end_time,
    status: row.status,
    price: row.price,
    comment: row.comment,
    service: servicesById.get(row.service_id) ?? null,
    master: mastersById.get(row.master_id) ?? null,
  }));
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed",
  );
  const today = getTodayDateString();
  const nextScheduledAppointment =
    [...appointments]
      .filter(
        (appointment) =>
          appointment.status === "scheduled" && appointment.date >= today,
      )
      .sort(
        (first, second) =>
          first.date.localeCompare(second.date)
          || first.start_time.localeCompare(second.start_time),
      )[0] ?? null;

  return {
    status: "ready",
    client,
    appointments,
    stats: {
      totalAppointments: appointments.length,
      completedAppointments: completedAppointments.length,
      cancelledAppointments: appointments.filter(
        (appointment) => appointment.status === "cancelled",
      ).length,
      noShowAppointments: appointments.filter(
        (appointment) => appointment.status === "no_show",
      ).length,
      totalRevenue: completedAppointments.reduce(
        (total, appointment) => total + toNumber(appointment.price),
        0,
      ),
      lastVisitDate: completedAppointments[0]?.date ?? null,
      nextScheduledAppointment,
    },
  };
}
