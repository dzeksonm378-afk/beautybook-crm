import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Введите имя владельца."),
  email: z.string().trim().email("Введите корректный email.").toLowerCase(),
  password: z.string().min(8, "Пароль должен быть не короче 8 символов."),
  salonName: z.string().trim().min(2, "Введите название салона."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Введите корректный email.").toLowerCase(),
  password: z.string().min(8, "Пароль должен быть не короче 8 символов."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
