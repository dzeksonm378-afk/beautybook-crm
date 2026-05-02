import { getAdminContext } from "@/lib/admin/context";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentStatus } from "@/lib/validations/appointment.schema";
import { appointmentStatuses } from "@/lib/validations/appointment.schema";

export type AppointmentListItem = {
  id: string;
  client_id: string;
  service_id: string;
  master_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  price: number | string;
  comment: string | null;
  created_at: string;
  updated_at: string;
  client: {
    full_name: string;
    phone: string;
  } | null;
  service: {
    title: string;
  } | null;
  master: {
    full_name: string;
  } | null;
};

export type AppointmentFormOptions = {
  clients: Array<{
    id: string;
    full_name: string;
    phone: string;
  }>;
  services: Array<{
    id: string;
    title: string;
    price: number | string;
    duration_minutes: number;
    category: string | null;
  }>;
  masters: Array<{
    id: string;
    full_name: string;
    specialization: string | null;
  }>;
};

export type AppointmentListResult =
  | {
      status: "ready";
      appointments: AppointmentListItem[];
      filters: AppointmentFilters;
    }
  | {
      status: "not_ready";
      appointments: [];
      filters: AppointmentFilters;
      reason: "unauthenticated" | "profileMissing" | "salonMissing";
    }
  | {
      status: "error";
      appointments: [];
      filters: AppointmentFilters;
    };

export type AppointmentOptionsResult =
  | {
      status: "ready";
      options: AppointmentFormOptions;
    }
  | {
      status: "not_ready";
      options: AppointmentFormOptions;
      reason: "unauthenticated" | "profileMissing" | "salonMissing";
    }
  | {
      status: "error";
      options: AppointmentFormOptions;
    };

type AppointmentRow = {
  id: string;
  client_id: string;
  service_id: string;
  master_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  price: number | string;
  comment: string | null;
  created_at: string;
  updated_at: string;
};

type AppointmentFilters = {
  clientId: string;
  date: string;
  masterId: string;
  status: string;
};

const emptyOptions: AppointmentFormOptions = {
  clients: [],
  services: [],
  masters: [],
};

function normalizeDate(date?: string) {
  const value = (date ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function normalizeUuid(value?: string) {
  const normalizedValue = (value ?? "").trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    normalizedValue,
  )
    ? normalizedValue
    : "";
}

function normalizeStatus(status?: string) {
  const value = (status ?? "").trim();
  return appointmentStatuses.includes(value as AppointmentStatus) ? value : "";
}

function getFilters(params?: {
  clientId?: string;
  date?: string;
  masterId?: string;
  status?: string;
}): AppointmentFilters {
  return {
    clientId: normalizeUuid(params?.clientId),
    date: normalizeDate(params?.date),
    masterId: normalizeUuid(params?.masterId),
    status: normalizeStatus(params?.status),
  };
}

function uniqueValues(values: string[]) {
  return [...new Set(values)];
}

export async function getAppointmentFormOptions(): Promise<AppointmentOptionsResult> {
  const adminContext = await getAdminContext();

  if (adminContext.status !== "ready") {
    return {
      status: "not_ready",
      options: emptyOptions,
      reason: adminContext.status,
    };
  }

  const supabase = await createClient();

  const [clientsResult, servicesResult, mastersResult] = await Promise.all([
    supabase
      .from("clients")
      .select("id, full_name, phone")
      .eq("salon_id", adminContext.salon.id)
      .order("full_name", { ascending: true }),
    supabase
      .from("services")
      .select("id, title, price, duration_minutes, category")
      .eq("salon_id", adminContext.salon.id)
      .eq("is_active", true)
      .order("title", { ascending: true }),
    supabase
      .from("masters")
      .select("id, full_name, specialization")
      .eq("salon_id", adminContext.salon.id)
      .eq("is_active", true)
      .order("full_name", { ascending: true }),
  ]);

  if (clientsResult.error || servicesResult.error || mastersResult.error) {
    return {
      status: "error",
      options: emptyOptions,
    };
  }

  return {
    status: "ready",
    options: {
      clients: clientsResult.data ?? [],
      services: servicesResult.data ?? [],
      masters: mastersResult.data ?? [],
    },
  };
}

export async function getAppointments(params?: {
  clientId?: string;
  date?: string;
  masterId?: string;
  status?: string;
}): Promise<AppointmentListResult> {
  const filters = getFilters(params);
  const adminContext = await getAdminContext();

  if (adminContext.status !== "ready") {
    return {
      status: "not_ready",
      appointments: [],
      filters,
      reason: adminContext.status,
    };
  }

  const supabase = await createClient();

  let query = supabase
    .from("appointments")
    .select(
      "id, client_id, service_id, master_id, date, start_time, end_time, status, price, comment, created_at, updated_at",
    )
    .eq("salon_id", adminContext.salon.id);

  if (filters.date) {
    query = query.eq("date", filters.date);
  }

  if (filters.clientId) {
    query = query.eq("client_id", filters.clientId);
  }

  if (filters.masterId) {
    query = query.eq("master_id", filters.masterId);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data: appointmentRows, error } = await query
    .order("date", { ascending: false })
    .order("start_time", { ascending: true })
    .limit(100);

  if (error) {
    return {
      status: "error",
      appointments: [],
      filters,
    };
  }

  const rows = (appointmentRows ?? []) as AppointmentRow[];

  if (rows.length === 0) {
    return {
      status: "ready",
      appointments: [],
      filters,
    };
  }

  const clientIds = uniqueValues(rows.map((row) => row.client_id));
  const serviceIds = uniqueValues(rows.map((row) => row.service_id));
  const masterIds = uniqueValues(rows.map((row) => row.master_id));

  const [clientsResult, servicesResult, mastersResult] = await Promise.all([
    supabase
      .from("clients")
      .select("id, full_name, phone")
      .eq("salon_id", adminContext.salon.id)
      .in("id", clientIds),
    supabase
      .from("services")
      .select("id, title")
      .eq("salon_id", adminContext.salon.id)
      .in("id", serviceIds),
    supabase
      .from("masters")
      .select("id, full_name")
      .eq("salon_id", adminContext.salon.id)
      .in("id", masterIds),
  ]);

  if (clientsResult.error || servicesResult.error || mastersResult.error) {
    return {
      status: "error",
      appointments: [],
      filters,
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

  return {
    status: "ready",
    appointments: rows.map((row) => ({
      ...row,
      client: clientsById.get(row.client_id) ?? null,
      service: servicesById.get(row.service_id) ?? null,
      master: mastersById.get(row.master_id) ?? null,
    })),
    filters,
  };
}
