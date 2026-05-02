import { createClient } from "@/lib/supabase/server";

type Profile = {
  id: string;
  full_name: string | null;
  role: "owner" | "admin" | "master";
  created_at: string;
};

type Salon = {
  id: string;
  owner_id: string;
  name: string;
  phone: string | null;
  address: string | null;
  working_hours: unknown;
  created_at: string;
  updated_at: string;
};

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, created_at")
      .eq("id", user.id)
      .maybeSingle<Profile>();

    if (error) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function getCurrentSalon(): Promise<Salon | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const { data, error } = await supabase
      .from("salons")
      .select("id, owner_id, name, phone, address, working_hours, created_at, updated_at")
      .eq("owner_id", user.id)
      .maybeSingle<Salon>();

    if (error) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}
