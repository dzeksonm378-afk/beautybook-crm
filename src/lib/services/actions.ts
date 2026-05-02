"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminPermission } from "@/lib/admin/guards";
import { createClient } from "@/lib/supabase/server";
import { serviceIdSchema, serviceSchema } from "@/lib/validations/service.schema";

function getField(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function servicesRedirect(error: string): never {
  const params = new URLSearchParams({ error });
  redirect(`/admin/services?${params.toString()}`);
}

export async function createServiceAction(formData: FormData) {
  const adminContext = await requireAdminPermission(
    "manageServices",
    "/admin/services",
  );

  const parsed = serviceSchema.safeParse({
    title: getField(formData, "title"),
    description: getField(formData, "description"),
    price: getField(formData, "price"),
    durationMinutes: getField(formData, "durationMinutes"),
    category: getField(formData, "category"),
  });

  if (!parsed.success) {
    servicesRedirect("validation");
  }

  const supabase = await createClient();
  const title = parsed.data.title;

  const { data: duplicateServices, error: duplicateError } = await supabase
    .from("services")
    .select("id")
    .eq("salon_id", adminContext.salon.id)
    .eq("title", title)
    .limit(1);

  if (duplicateError) {
    servicesRedirect("create_failed");
  }

  if (duplicateServices && duplicateServices.length > 0) {
    servicesRedirect("duplicate_title");
  }

  const { error: createError } = await supabase.from("services").insert({
    salon_id: adminContext.salon.id,
    title,
    description: parsed.data.description ?? null,
    price: parsed.data.price,
    duration_minutes: parsed.data.durationMinutes,
    category: parsed.data.category,
    is_active: true,
  });

  if (createError) {
    servicesRedirect("create_failed");
  }

  revalidatePath("/admin/services");
  redirect("/admin/services?created=1");
}

export async function toggleServiceStatusAction(formData: FormData) {
  const adminContext = await requireAdminPermission(
    "manageServices",
    "/admin/services",
  );

  const parsedServiceId = serviceIdSchema.safeParse(getField(formData, "serviceId"));

  if (!parsedServiceId.success) {
    servicesRedirect("update_failed");
  }

  const supabase = await createClient();

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id, is_active")
    .eq("id", parsedServiceId.data)
    .eq("salon_id", adminContext.salon.id)
    .maybeSingle<{ id: string; is_active: boolean }>();

  if (serviceError || !service) {
    servicesRedirect("update_failed");
  }

  const { error: updateError } = await supabase
    .from("services")
    .update({ is_active: !service.is_active })
    .eq("id", service.id)
    .eq("salon_id", adminContext.salon.id);

  if (updateError) {
    servicesRedirect("update_failed");
  }

  revalidatePath("/admin/services");
  redirect("/admin/services?updated=1");
}
