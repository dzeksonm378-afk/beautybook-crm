"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminPermission } from "@/lib/admin/guards";
import { createClient } from "@/lib/supabase/server";
import { masterIdSchema, masterSchema } from "@/lib/validations/master.schema";

function getField(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function mastersRedirect(error: string): never {
  const params = new URLSearchParams({ error });
  redirect(`/admin/masters?${params.toString()}`);
}

export async function createMasterAction(formData: FormData) {
  const adminContext = await requireAdminPermission(
    "manageMasters",
    "/admin/masters",
  );

  const parsed = masterSchema.safeParse({
    fullName: getField(formData, "fullName"),
    specialization: getField(formData, "specialization"),
    phone: getField(formData, "phone"),
    email: getField(formData, "email"),
  });

  if (!parsed.success) {
    mastersRedirect("validation");
  }

  const supabase = await createClient();
  const fullName = normalizeText(parsed.data.fullName);
  const specialization = parsed.data.specialization
    ? normalizeText(parsed.data.specialization)
    : null;
  const phone = parsed.data.phone ? normalizeText(parsed.data.phone) : null;

  const { data: duplicateMasters, error: duplicateError } = await supabase
    .from("masters")
    .select("id")
    .eq("salon_id", adminContext.salon.id)
    .ilike("full_name", fullName)
    .limit(1);

  if (duplicateError) {
    mastersRedirect("create_failed");
  }

  if (duplicateMasters && duplicateMasters.length > 0) {
    mastersRedirect("duplicate_name");
  }

  const { error: createError } = await supabase.from("masters").insert({
    salon_id: adminContext.salon.id,
    full_name: fullName,
    specialization,
    phone,
    email: parsed.data.email ?? null,
    is_active: true,
  });

  if (createError) {
    mastersRedirect("create_failed");
  }

  revalidatePath("/admin/masters");
  redirect("/admin/masters?created=1");
}

export async function toggleMasterStatusAction(formData: FormData) {
  const adminContext = await requireAdminPermission(
    "manageMasters",
    "/admin/masters",
  );

  const parsedMasterId = masterIdSchema.safeParse(getField(formData, "masterId"));

  if (!parsedMasterId.success) {
    mastersRedirect("update_failed");
  }

  const supabase = await createClient();

  const { data: master, error: masterError } = await supabase
    .from("masters")
    .select("id, is_active")
    .eq("id", parsedMasterId.data)
    .eq("salon_id", adminContext.salon.id)
    .maybeSingle<{ id: string; is_active: boolean }>();

  if (masterError || !master) {
    mastersRedirect("update_failed");
  }

  const { error: updateError } = await supabase
    .from("masters")
    .update({ is_active: !master.is_active })
    .eq("id", master.id)
    .eq("salon_id", adminContext.salon.id);

  if (updateError) {
    mastersRedirect("update_failed");
  }

  revalidatePath("/admin/masters");
  redirect("/admin/masters?updated=1");
}
