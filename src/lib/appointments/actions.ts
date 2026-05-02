"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminPermission } from "@/lib/admin/guards";
import {
  calculateEndTime,
  getWorkingHoursForDate,
  isDateInBookingRange,
  isStartBeforeEnd,
  isValidTimeString,
  isWithinWorkingHours,
  normalizeTimeForPostgres,
  timesOverlap,
} from "@/lib/appointments/utils";
import { createClient } from "@/lib/supabase/server";
import {
  appointmentSchema,
  appointmentStatusSchema,
  appointmentUpdateSchema,
} from "@/lib/validations/appointment.schema";
import type { AppointmentStatus } from "@/lib/validations/appointment.schema";

function getField(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function appointmentsRedirect(error: string): never {
  const params = new URLSearchParams({ error });
  redirect(`/admin/appointments?${params.toString()}`);
}

export async function createAppointmentAction(formData: FormData) {
  const adminContext = await requireAdminPermission(
    "manageAppointments",
    "/admin/appointments",
  );

  const parsed = appointmentSchema.safeParse({
    clientId: getField(formData, "clientId"),
    serviceId: getField(formData, "serviceId"),
    masterId: getField(formData, "masterId"),
    date: getField(formData, "date"),
    startTime: getField(formData, "startTime"),
    comment: getField(formData, "comment"),
  });

  if (!parsed.success) {
    appointmentsRedirect("validation");
  }

  const supabase = await createClient();
  const { clientId, serviceId, masterId, date, startTime } = parsed.data;

  if (!isDateInBookingRange(date)) {
    appointmentsRedirect("date_out_of_range");
  }

  if (!isValidTimeString(startTime)) {
    appointmentsRedirect("invalid_time");
  }

  const [clientResult, serviceResult, masterResult] = await Promise.all([
    supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("salon_id", adminContext.salon.id)
      .maybeSingle<{ id: string }>(),
    supabase
      .from("services")
      .select("id, price, duration_minutes")
      .eq("id", serviceId)
      .eq("salon_id", adminContext.salon.id)
      .eq("is_active", true)
      .maybeSingle<{ id: string; price: number | string; duration_minutes: number }>(),
    supabase
      .from("masters")
      .select("id")
      .eq("id", masterId)
      .eq("salon_id", adminContext.salon.id)
      .eq("is_active", true)
      .maybeSingle<{ id: string }>(),
  ]);

  if (
    clientResult.error ||
    serviceResult.error ||
    masterResult.error ||
    !clientResult.data ||
    !serviceResult.data ||
    !masterResult.data
  ) {
    appointmentsRedirect("missing_options");
  }

  const normalizedStartTime = normalizeTimeForPostgres(startTime);
  const endTime = calculateEndTime(startTime, serviceResult.data.duration_minutes);

  if (!isValidTimeString(endTime) || !isStartBeforeEnd(normalizedStartTime, endTime)) {
    appointmentsRedirect("invalid_time");
  }

  const workingHoursForDay = getWorkingHoursForDate(
    date,
    adminContext.salon.working_hours,
  );

  if (!isWithinWorkingHours(normalizedStartTime, endTime, workingHoursForDay)) {
    appointmentsRedirect("outside_working_hours");
  }

  const { data: scheduledAppointments, error: conflictSelectError } = await supabase
    .from("appointments")
    .select("id, start_time, end_time")
    .eq("salon_id", adminContext.salon.id)
    .eq("master_id", masterId)
    .eq("date", date)
    .eq("status", "scheduled");

  if (conflictSelectError) {
    appointmentsRedirect("create_failed");
  }

  const hasConflict = (scheduledAppointments ?? []).some((appointment) =>
    timesOverlap(
      normalizedStartTime,
      endTime,
      appointment.start_time,
      appointment.end_time,
    ),
  );

  if (hasConflict) {
    appointmentsRedirect("time_conflict");
  }

  const { error: createError } = await supabase.from("appointments").insert({
    salon_id: adminContext.salon.id,
    client_id: clientId,
    service_id: serviceId,
    master_id: masterId,
    date,
    start_time: normalizedStartTime,
    end_time: endTime,
    status: "scheduled",
    price: serviceResult.data.price,
    comment: parsed.data.comment ?? null,
  });

  if (createError) {
    appointmentsRedirect("create_failed");
  }

  revalidatePath("/admin/appointments");
  redirect("/admin/appointments?created=1");
}

export async function updateAppointmentAction(formData: FormData) {
  const adminContext = await requireAdminPermission(
    "manageAppointments",
    "/admin/appointments",
  );

  const parsed = appointmentUpdateSchema.safeParse({
    appointmentId: getField(formData, "appointmentId"),
    clientId: getField(formData, "clientId"),
    serviceId: getField(formData, "serviceId"),
    masterId: getField(formData, "masterId"),
    date: getField(formData, "date"),
    startTime: getField(formData, "startTime"),
    comment: getField(formData, "comment"),
  });

  if (!parsed.success) {
    appointmentsRedirect("validation");
  }

  const supabase = await createClient();
  const {
    appointmentId,
    clientId,
    serviceId,
    masterId,
    date,
    startTime,
  } = parsed.data;

  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .select("id, status")
    .eq("id", appointmentId)
    .eq("salon_id", adminContext.salon.id)
    .maybeSingle<{ id: string; status: AppointmentStatus }>();

  if (appointmentError) {
    appointmentsRedirect("update_failed");
  }

  if (!appointment) {
    appointmentsRedirect("not_found");
  }

  if (appointment.status !== "scheduled") {
    appointmentsRedirect("edit_not_allowed");
  }

  if (!isDateInBookingRange(date)) {
    appointmentsRedirect("date_out_of_range");
  }

  if (!isValidTimeString(startTime)) {
    appointmentsRedirect("invalid_time");
  }

  const [clientResult, serviceResult, masterResult] = await Promise.all([
    supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("salon_id", adminContext.salon.id)
      .maybeSingle<{ id: string }>(),
    supabase
      .from("services")
      .select("id, price, duration_minutes")
      .eq("id", serviceId)
      .eq("salon_id", adminContext.salon.id)
      .eq("is_active", true)
      .maybeSingle<{ id: string; price: number | string; duration_minutes: number }>(),
    supabase
      .from("masters")
      .select("id")
      .eq("id", masterId)
      .eq("salon_id", adminContext.salon.id)
      .eq("is_active", true)
      .maybeSingle<{ id: string }>(),
  ]);

  if (clientResult.error || !clientResult.data) {
    appointmentsRedirect("validation");
  }

  if (
    serviceResult.error ||
    masterResult.error ||
    !serviceResult.data ||
    !masterResult.data
  ) {
    appointmentsRedirect("inactive_option");
  }

  const normalizedStartTime = normalizeTimeForPostgres(startTime);
  const endTime = calculateEndTime(startTime, serviceResult.data.duration_minutes);

  if (!isValidTimeString(endTime) || !isStartBeforeEnd(normalizedStartTime, endTime)) {
    appointmentsRedirect("invalid_time");
  }

  const workingHoursForDay = getWorkingHoursForDate(
    date,
    adminContext.salon.working_hours,
  );

  if (!isWithinWorkingHours(normalizedStartTime, endTime, workingHoursForDay)) {
    appointmentsRedirect("outside_working_hours");
  }

  const { data: scheduledAppointments, error: conflictSelectError } = await supabase
    .from("appointments")
    .select("id, start_time, end_time")
    .eq("salon_id", adminContext.salon.id)
    .eq("master_id", masterId)
    .eq("date", date)
    .eq("status", "scheduled")
    .neq("id", appointment.id);

  if (conflictSelectError) {
    appointmentsRedirect("update_failed");
  }

  const hasConflict = (scheduledAppointments ?? []).some((scheduledAppointment) =>
    timesOverlap(
      normalizedStartTime,
      endTime,
      scheduledAppointment.start_time,
      scheduledAppointment.end_time,
    ),
  );

  if (hasConflict) {
    appointmentsRedirect("time_conflict");
  }

  const { error: updateError } = await supabase
    .from("appointments")
    .update({
      client_id: clientId,
      service_id: serviceId,
      master_id: masterId,
      date,
      start_time: normalizedStartTime,
      end_time: endTime,
      price: serviceResult.data.price,
      comment: parsed.data.comment ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", appointment.id)
    .eq("salon_id", adminContext.salon.id);

  if (updateError) {
    appointmentsRedirect("update_failed");
  }

  revalidatePath("/admin/appointments");
  redirect("/admin/appointments?updated=1");
}

export async function updateAppointmentStatusAction(formData: FormData) {
  const adminContext = await requireAdminPermission(
    "manageAppointments",
    "/admin/appointments",
  );

  const parsed = appointmentStatusSchema.safeParse({
    appointmentId: getField(formData, "appointmentId"),
    status: getField(formData, "status"),
  });

  if (!parsed.success) {
    appointmentsRedirect("update_failed");
  }

  const supabase = await createClient();

  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .select("id, master_id, date, start_time, end_time")
    .eq("id", parsed.data.appointmentId)
    .eq("salon_id", adminContext.salon.id)
    .maybeSingle<{
      id: string;
      master_id: string;
      date: string;
      start_time: string;
      end_time: string;
    }>();

  if (appointmentError || !appointment) {
    appointmentsRedirect("update_failed");
  }

  if (parsed.data.status === "scheduled") {
    const { data: scheduledAppointments, error: conflictSelectError } =
      await supabase
        .from("appointments")
        .select("id, start_time, end_time")
        .eq("salon_id", adminContext.salon.id)
        .eq("master_id", appointment.master_id)
        .eq("date", appointment.date)
        .eq("status", "scheduled")
        .neq("id", appointment.id);

    if (conflictSelectError) {
      appointmentsRedirect("update_failed");
    }

    const hasConflict = (scheduledAppointments ?? []).some((scheduledAppointment) =>
      timesOverlap(
        appointment.start_time,
        appointment.end_time,
        scheduledAppointment.start_time,
        scheduledAppointment.end_time,
      ),
    );

    if (hasConflict) {
      appointmentsRedirect("time_conflict");
    }
  }

  const { error } = await supabase
    .from("appointments")
    .update({ status: parsed.data.status })
    .eq("id", appointment.id)
    .eq("salon_id", adminContext.salon.id);

  if (error) {
    appointmentsRedirect("update_failed");
  }

  revalidatePath("/admin/appointments");
  redirect("/admin/appointments?updated=1");
}
