import { getAdminContext } from "@/lib/admin/context";
import { createClient } from "@/lib/supabase/server";

export type ServiceListItem = {
  id: string;
  title: string;
  description: string | null;
  price: number | string;
  duration_minutes: number;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ServiceListResult =
  | {
      status: "ready";
      services: ServiceListItem[];
      query: string;
      category: string;
    }
  | {
      status: "not_ready";
      services: [];
      query: string;
      category: string;
      reason: "unauthenticated" | "profileMissing" | "salonMissing";
    }
  | {
      status: "error";
      services: [];
      query: string;
      category: string;
    };

function normalizeSearchQuery(query?: string) {
  return (query ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
}

function normalizeCategory(category?: string) {
  return (category ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
}

function escapePostgrestSearchValue(value: string) {
  return value.replace(/[%_(),]/g, " ").replace(/\s+/g, " ").trim();
}

export async function getServices(params?: {
  q?: string;
  category?: string;
}): Promise<ServiceListResult> {
  const searchQuery = normalizeSearchQuery(params?.q);
  const category = normalizeCategory(params?.category);
  const adminContext = await getAdminContext();

  if (adminContext.status !== "ready") {
    return {
      status: "not_ready",
      services: [],
      query: searchQuery,
      category,
      reason: adminContext.status,
    };
  }

  const supabase = await createClient();

  let query = supabase
    .from("services")
    .select(
      "id, title, description, price, duration_minutes, category, is_active, created_at, updated_at",
    )
    .eq("salon_id", adminContext.salon.id);

  const safeSearchValue = escapePostgrestSearchValue(searchQuery);

  if (safeSearchValue) {
    query = query.or(
      `title.ilike.%${safeSearchValue}%,description.ilike.%${safeSearchValue}%`,
    );
  }

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return {
      status: "error",
      services: [],
      query: searchQuery,
      category,
    };
  }

  return {
    status: "ready",
    services: data ?? [],
    query: searchQuery,
    category,
  };
}
