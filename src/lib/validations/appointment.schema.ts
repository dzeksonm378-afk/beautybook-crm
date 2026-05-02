import { z } from "zod";

export const appointmentStatuses = [
  "scheduled",
  "completed",
  "cancelled",
  "no_show",
] as const;

function emptyToUndefined(value: unknown) {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}

export const appointmentSchema = z.object({
  clientId: z.string().uuid("Выберите клиента."),
  serviceId: z.string().uuid("Выберите услугу."),
  masterId: z.string().uuid("Выберите мастера."),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Выберите дату."),
  startTime: z
    .string()
    .trim()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, "Выберите время начала."),
  comment: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(1000, "Комментарий слишком длинный.").optional(),
  ),
  status: z.enum(appointmentStatuses).optional(),
});

export const appointmentStatusSchema = z.object({
  appointmentId: z.string().uuid(),
  status: z.enum(appointmentStatuses),
});

export const appointmentUpdateSchema = appointmentSchema
  .omit({ status: true })
  .extend({
    appointmentId: z.string().uuid("Запись не найдена."),
  });

export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type AppointmentUpdateInput = z.infer<typeof appointmentUpdateSchema>;
export type AppointmentStatus = (typeof appointmentStatuses)[number];
