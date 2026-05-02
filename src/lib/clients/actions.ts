"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminPermission } from "@/lib/admin/guards";
import { createClient } from "@/lib/supabase/server";
import { clientSchema } from "@/lib/validations/client.schema";

function getField(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function normalizeClientPhone(phone: string) {
  return phone.trim().replace(/\s+/g, " ");
}

function clientsRedirect(error: string): never {
  const params = new URLSearchParams({ error });
  redirect(`/admin/clients?${params.toString()}`);
}

function clientDetailsRedirect(clientId: string, error: string): never {
  const params = new URLSearchParams({ error });
  redirect(`/admin/clients/${clientId}?${params.toString()}`);
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function createClientAction(formData: FormData) {
  const adminContext = await requireAdminPermission(
    "manageClients",
    "/admin/clients",
  );

  const parsed = clientSchema.safeParse({
    fullName: getField(formData, "fullName"),
    phone: getField(formData, "phone"),
    email: getField(formData, "email"),
    birthday: getField(formData, "birthday"),
    notes: getField(formData, "notes"),
  });

  if (!parsed.success) {
    clientsRedirect("validation");
  }

  const phone = normalizeClientPhone(parsed.data.phone);
  const supabase = await createClient();

  const { data: duplicateClients, error: duplicateError } = await supabase
    .from("clients")
    .select("id")
    .eq("salon_id", adminContext.salon.id)
    .eq("phone", phone)
    .limit(1);

  if (duplicateError) {
    clientsRedirect("create_failed");
  }

  if (duplicateClients && duplicateClients.length > 0) {
    clientsRedirect("duplicate_phone");
  }

  const { error: createError } = await supabase.from("clients").insert({
    salon_id: adminContext.salon.id,
    full_name: parsed.data.fullName,
    phone,
    email: parsed.data.email ?? null,
    birthday: parsed.data.birthday ?? null,
    notes: parsed.data.notes ?? null,
  });

  if (createError) {
    clientsRedirect("create_failed");
  }

  revalidatePath("/admin/clients");
  redirect("/admin/clients?created=1");
}

export async function updateClientAction(formData: FormData) {
  const adminContext = await requireAdminPermission(
    "manageClients",
    "/admin/clients",
  );

  const clientId = getField(formData, "clientId").trim();

  if (!isUuid(clientId)) {
    clientsRedirect("not_found");
  }

  const parsed = clientSchema.safeParse({
    fullName: getField(formData, "fullName"),
    phone: getField(formData, "phone"),
    email: getField(formData, "email"),
    birthday: getField(formData, "birthday"),
    notes: getField(formData, "notes"),
  });

  if (!parsed.success) {
    clientDetailsRedirect(clientId, "validation");
  }

  const supabase = await createClient();
  const { data: existingClient, error: existingClientError } = await supabase
    .from("clients")
    .select("id")
    .eq("id", clientId)
    .eq("salon_id", adminContext.salon.id)
    .maybeSingle<{ id: string }>();

  if (existingClientError) {
    clientDetailsRedirect(clientId, "update_failed");
  }

  if (!existingClient) {
    clientDetailsRedirect(clientId, "not_found");
  }

  const phone = normalizeClientPhone(parsed.data.phone);

  const { data: duplicateClients, error: duplicateError } = await supabase
    .from("clients")
    .select("id")
    .eq("salon_id", adminContext.salon.id)
    .eq("phone", phone)
    .neq("id", clientId)
    .limit(1);

  if (duplicateError) {
    clientDetailsRedirect(clientId, "update_failed");
  }

  if (duplicateClients && duplicateClients.length > 0) {
    clientDetailsRedirect(clientId, "duplicate_phone");
  }

  const { error: updateError } = await supabase
    .from("clients")
    .update({
      full_name: parsed.data.fullName,
      phone,
      email: parsed.data.email ?? null,
      birthday: parsed.data.birthday ?? null,
      notes: parsed.data.notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", clientId)
    .eq("salon_id", adminContext.salon.id);

  if (updateError) {
    clientDetailsRedirect(clientId, "update_failed");
  }

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${clientId}`);
  redirect(`/admin/clients/${clientId}?updated=1`);
}
