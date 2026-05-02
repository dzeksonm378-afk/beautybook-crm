import { getAdminContext } from "@/lib/admin/context";
import { createClient } from "@/lib/supabase/server";

export type MasterListItem = {
  id: string;
  full_name: string;
  specialization: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MasterListResult =
  | {
      status: "ready";
      masters: MasterListItem[];
      query: string;
    }
  | {
      status: "not_ready";
      masters: [];
      query: string;
      reason: "unauthenticated" | "profileMissing" | "salonMissing";
    }
  | {
      status: "error";
      masters: [];
      query: string;
    };

function normalizeSearchQuery(query?: string) {
  return (query ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
}

function escapePostgrestSearchValue(value: string) {
  return value.replace(/[%_(),]/g, " ").replace(/\s+/g, " ").trim();
}

export async function getMasters(params?: { q?: string }): Promise<MasterListResult> {
  const searchQuery = normalizeSearchQuery(params?.q);
  const adminContext = await getAdminContext();

  if (adminContext.status !== "ready") {
    return {
      status: "not_ready",
      masters: [],
      query: searchQuery,
      reason: adminContext.status,
    };
  }

  const supabase = await createClient();

  let query = supabase
    .from("masters")
    .select("id, full_name, specialization, phone, email, is_active, created_at, updated_at")
    .eq("salon_id", adminContext.salon.id);

  const safeSearchValue = escapePostgrestSearchValue(searchQuery);

  if (safeSearchValue) {
    query = query.or(
      `full_name.ilike.%${safeSearchValue}%,specialization.ilike.%${safeSearchValue}%`,
    );
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return {
      status: "error",
      masters: [],
      query: searchQuery,
    };
  }

  return {
    status: "ready",
    masters: data ?? [],
    query: searchQuery,
  };
}
