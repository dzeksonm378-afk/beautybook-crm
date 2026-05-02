import { redirect } from "next/navigation";

import {
  getAdminContext,
  type ReadyAdminContext,
} from "@/lib/admin/context";
import { can, type Permission, type StaffRole } from "@/lib/admin/permissions";

export type AdminPageAccess =
  | {
      status: "ready";
      context: ReadyAdminContext;
    }
  | {
      status: "not_ready";
      reason: "profileMissing" | "salonMissing";
    }
  | {
      status: "forbidden";
      role: StaffRole;
    };

export async function getAdminPageAccess(
  permission: Permission,
): Promise<AdminPageAccess> {
  const adminContext = await getAdminContext();

  if (adminContext.status === "unauthenticated") {
    redirect("/login?reason=staff_only");
  }

  if (adminContext.status !== "ready") {
    return {
      status: "not_ready",
      reason: adminContext.status,
    };
  }

  if (!can(adminContext.role, permission)) {
    return {
      status: "forbidden",
      role: adminContext.role,
    };
  }

  return {
    status: "ready",
    context: adminContext,
  };
}

export async function requireAdminPermission(
  permission: Permission,
  errorRedirectPath: string,
) {
  const adminContext = await getAdminContext();

  if (adminContext.status === "unauthenticated") {
    redirect("/login?reason=staff_only");
  }

  if (adminContext.status !== "ready") {
    const params = new URLSearchParams({ error: "access" });
    redirect(`${errorRedirectPath}?${params.toString()}`);
  }

  if (!can(adminContext.role, permission)) {
    const params = new URLSearchParams({ error: "forbidden" });
    redirect(`${errorRedirectPath}?${params.toString()}`);
  }

  return adminContext;
}
