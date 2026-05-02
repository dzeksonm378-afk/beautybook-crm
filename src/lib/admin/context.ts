import type { User } from "@supabase/supabase-js";

import {
  isValidStaffRole,
  type StaffRole,
} from "@/lib/admin/permissions";
import { createClient } from "@/lib/supabase/server";

export type AdminProfile = {
  id: string;
  full_name: string | null;
  role: StaffRole;
  created_at: string;
};

export type AdminSalon = {
  id: string;
  owner_id: string;
  name: string;
  phone: string | null;
  address: string | null;
  working_hours: unknown;
  created_at: string;
  updated_at: string;
};

export type ReadyAdminContext = {
  status: "ready";
  user: User;
  profile: AdminProfile;
  salon: AdminSalon;
  role: StaffRole;
  isOwner: boolean;
  isAdmin: boolean;
  isMaster: boolean;
};

export type AdminContext =
  | {
      status: "unauthenticated";
      user: null;
      profile: null;
      salon: null;
      role: null;
      isOwner: false;
      isAdmin: false;
      isMaster: false;
    }
  | {
      status: "profileMissing";
      user: User;
      profile: null;
      salon: null;
      role: null;
      isOwner: false;
      isAdmin: false;
      isMaster: false;
    }
  | {
      status: "salonMissing";
      user: User;
      profile: AdminProfile;
      salon: null;
      role: StaffRole;
      isOwner: boolean;
      isAdmin: boolean;
      isMaster: boolean;
    }
  | ReadyAdminContext;

function getRoleFlags(role: StaffRole) {
  return {
    isOwner: role === "owner",
    isAdmin: role === "admin",
    isMaster: role === "master",
  };
}

export async function getAdminContext(): Promise<AdminContext> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        status: "unauthenticated",
        user: null,
        profile: null,
        salon: null,
        role: null,
        isOwner: false,
        isAdmin: false,
        isMaster: false,
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, role, created_at")
      .eq("id", user.id)
      .maybeSingle<AdminProfile>();

    if (profileError || !profile) {
      return {
        status: "profileMissing",
        user,
        profile: null,
        salon: null,
        role: null,
        isOwner: false,
        isAdmin: false,
        isMaster: false,
      };
    }

    if (!isValidStaffRole(profile.role)) {
      return {
        status: "profileMissing",
        user,
        profile: null,
        salon: null,
        role: null,
        isOwner: false,
        isAdmin: false,
        isMaster: false,
      };
    }

    const roleFlags = getRoleFlags(profile.role);

    const { data: salon, error: salonError } = await supabase
      .from("salons")
      .select("id, owner_id, name, phone, address, working_hours, created_at, updated_at")
      .eq("owner_id", user.id)
      .maybeSingle<AdminSalon>();

    if (salonError || !salon) {
      return {
        status: "salonMissing",
        user,
        profile,
        salon: null,
        role: profile.role,
        ...roleFlags,
      };
    }

    return {
      status: "ready",
      user,
      profile,
      salon,
      role: profile.role,
      ...roleFlags,
    };
  } catch {
    return {
      status: "unauthenticated",
      user: null,
      profile: null,
      salon: null,
      role: null,
      isOwner: false,
      isAdmin: false,
      isMaster: false,
    };
  }
}
