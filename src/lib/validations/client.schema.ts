import { z } from "zod";

function emptyToUndefined(value: unknown) {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}

export const clientSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Введите имя клиента.")
    .max(120, "Имя клиента слишком длинное."),
  phone: z
    .string()
    .trim()
    .min(5, "Введите телефон клиента.")
    .max(30, "Телефон слишком длинный."),
  email: z.preprocess(
    emptyToUndefined,
    z.string().trim().email("Введите корректный email.").max(254).optional(),
  ),
  birthday: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Введите дату в формате YYYY-MM-DD.")
      .optional(),
  ),
  notes: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(1000, "Заметка слишком длинная.").optional(),
  ),
});

export type ClientInput = z.infer<typeof clientSchema>;
