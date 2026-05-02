"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminPermission } from "@/lib/admin/guards";
import { createClient } from "@/lib/supabase/server";
import {
  normalizeWorkingHours,
  salonSettingsSchema,
  weekdayKeys,
  type WeekdayKey,
} from "@/lib/validations/settings.schema";

function getField(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function getOpenField(formData: FormData, day: WeekdayKey) {
  return formData.get(`${day}_open`) === "1";
}

function settingsRedirect(error: string): never {
  const params = new URLSearchParams({ error });
  redirect(`/admin/settings?${params.toString()}`);
}

export async function updateSalonSettingsAction(formData: FormData) {
  const adminContext = await requireAdminPermission(
    "manageSettings",
    "/admin/settings",
  );

  if (adminContext.salon.owner_id !== adminContext.user.id) {
    settingsRedirect("forbidden");
  }

  const parsed = salonSettingsSchema.safeParse({
    name: getField(formData, "name"),
    phone: getField(formData, "phone"),
    address: getField(formData, "address"),
    workingHours: weekdayKeys.reduce(
      (result, day) => ({
        ...result,
        [day]: {
          open: getOpenField(formData, day),
          from: getField(formData, `${day}_from`),
          to: getField(formData, `${day}_to`),
        },
      }),
      {} as Record<WeekdayKey, { open: boolean; from: string; to: string }>,
    ),
  });

  if (!parsed.success) {
    settingsRedirect("validation");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("salons")
    .update({
      name: parsed.data.name,
      phone: parsed.data.phone ?? null,
      address: parsed.data.address ?? null,
      working_hours: normalizeWorkingHours(parsed.data.workingHours),
      updated_at: new Date().toISOString(),
    })
    .eq("id", adminContext.salon.id)
    .eq("owner_id", adminContext.user.id);

  if (error) {
    settingsRedirect("update_failed");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?updated=1");
}
