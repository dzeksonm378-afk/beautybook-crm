import { z } from "zod";

function emptyToUndefined(value: unknown) {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}

export const masterSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Введите имя мастера.")
    .max(120, "Имя мастера слишком длинное."),
  specialization: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(120, "Специализация слишком длинная.").optional(),
  ),
  phone: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(30, "Телефон слишком длинный.").optional(),
  ),
  email: z.preprocess(
    emptyToUndefined,
    z.string().trim().email("Введите корректный email.").max(254).optional(),
  ),
  isActive: z.boolean().optional(),
});

export const masterIdSchema = z.string().uuid();

export type MasterInput = z.infer<typeof masterSchema>;
