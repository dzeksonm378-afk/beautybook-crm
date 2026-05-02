import Link from "next/link";

import { loginAction } from "@/lib/auth/actions";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageShell } from "@/components/shared/PageShell";
import { StatusBadge } from "@/components/shared/StatusBadge";

const errorMessages: Record<string, string> = {
  credentials: "Не удалось войти. Проверьте email и пароль.",
  env: "Настройки Supabase не найдены. Проверьте .env.local.",
  onboarding: "Не удалось подготовить профиль сотрудника. Обратитесь к владельцу салона.",
  validation: "Проверьте email и пароль. Пароль должен быть не короче 8 символов.",
};

const reasonMessages: Record<string, string> = {
  staff_only: "Войдите как сотрудник салона, чтобы открыть CRM.",
};

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    reason?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params?.error ? errorMessages[params.error] : null;
  const reason = params?.reason ? reasonMessages[params.reason] : null;

  return (
    <>
      <PublicHeader />
      <PageShell
        description="Для владельца, администратора и мастеров салона. Клиенты записываются онлайн без аккаунта."
        eyebrow="вход для сотрудников"
        title="Вход в CRM"
      >
        <div className="mx-auto max-w-xl rounded-[32px] border border-taupe/25 bg-white/80 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge tone="gold">защищённый вход</StatusBadge>
            <StatusBadge tone="preview">только сотрудники</StatusBadge>
          </div>

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

          <form action={loginAction} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Email
              </span>
              <input
                autoComplete="email"
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                name="email"
                placeholder="staff@example.com"
                required
                type="email"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Пароль
              </span>
              <input
                autoComplete="current-password"
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white"
                minLength={8}
                name="password"
                placeholder="Минимум 8 символов"
                required
                type="password"
              />
            </label>

            <button
              className="h-12 w-full rounded-full bg-graphite px-5 text-sm font-bold text-porcelain transition hover:bg-plum"
              type="submit"
            >
              Войти в CRM
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm leading-6 text-graphite/62">
              Нет доступа? Обратитесь к владельцу салона. Доступ выдаётся
              владельцем или администратором, клиентам аккаунт не нужен.
            </p>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-full border border-taupe/35 px-5 text-sm font-bold text-plum transition hover:border-champagne hover:text-graphite"
            >
              Вернуться на сайт
            </Link>
          </div>
        </div>
      </PageShell>
      <PublicFooter />
    </>
  );
}
