"use client";

import { useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
  credentials: "Не удалось войти. Проверьте email и пароль.",
  env: "Настройки Supabase не найдены. Проверьте .env.local.",
  onboarding:
    "Не удалось подготовить профиль сотрудника. Обратитесь к владельцу салона.",
  validation: "Проверьте email и пароль. Пароль должен быть не короче 8 символов.",
};

const reasonMessages: Record<string, string> = {
  staff_only: "Войдите как сотрудник салона, чтобы открыть CRM.",
};

export function LoginFeedback() {
  const searchParams = useSearchParams();
  const errorKey = searchParams.get("error");
  const reasonKey = searchParams.get("reason");
  const error = errorKey ? errorMessages[errorKey] : null;
  const reason = reasonKey ? reasonMessages[reasonKey] : null;

  return (
    <>
      {error ? (
        <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-medium text-plum">
          {error}
        </p>
      ) : null}

      {reason ? (
        <p className="mt-5 rounded-[20px] border border-champagne/25 bg-champagne/10 px-4 py-3 text-sm font-medium text-graphite">
          {reason}
        </p>
      ) : null}
    </>
  );
}
