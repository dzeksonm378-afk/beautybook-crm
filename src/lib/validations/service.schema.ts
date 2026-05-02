import { z } from "zod";

export const serviceCategories = [
  "Маникюр",
  "Педикюр",
  "Волосы",
  "Брови",
  "Косметология",
  "Массаж",
  "Другое",
] as const;

function emptyToUndefined(value: unknown) {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}

function numberInput(value: unknown) {
  if (typeof value === "string") {
    const normalizedValue = value.trim().replace(",", ".");

    if (normalizedValue === "") {
      return Number.NaN;
    }

    return Number(normalizedValue);
  }

  return value;
}

export const serviceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Введите название услуги.")
    .max(120, "Название услуги слишком длинное."),
  description: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(1000, "Описание слишком длинное.").optional(),
  ),
  price: z.preprocess(
    numberInput,
    z
      .number({ error: "Введите цену." })
      .min(0, "Цена не может быть отрицательной."),
  ),
  durationMinutes: z.preprocess(
    numberInput,
    z
      .number({ error: "Введите длительность." })
      .int("Длительность должна быть целым числом минут.")
      .min(5, "Минимальная длительность — 5 минут.")
      .max(600, "Максимальная длительность — 600 минут."),
  ),
  category: z
    .string()
    .trim()
    .min(2, "Выберите категорию.")
    .max(80, "Категория слишком длинная."),
  isActive: z.boolean().optional(),
});

export const serviceIdSchema = z.string().uuid();

export type ServiceInput = z.infer<typeof serviceSchema>;
