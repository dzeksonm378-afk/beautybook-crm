import type { ReadyAdminContext } from "@/lib/admin/context";
import { getAdminContext } from "@/lib/admin/context";

export type SalonSettingsResult =
  | {
      status: "ready";
      context: ReadyAdminContext;
    }
  | {
      status: "not_ready";
      context: null;
      reason: "unauthenticated" | "profileMissing" | "salonMissing";
    };

export async function getSalonSettings(): Promise<SalonSettingsResult> {
  const adminContext = await getAdminContext();

  if (adminContext.status !== "ready") {
    return {
      status: "not_ready",
      context: null,
      reason: adminContext.status,
    };
  }

  return {
    status: "ready",
    context: adminContext,
  };
}
