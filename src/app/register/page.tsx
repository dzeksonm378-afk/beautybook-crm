import Link from "next/link";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageShell } from "@/components/shared/PageShell";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default function RegisterPage() {
  return (
    <>
      <PublicHeader />
      <PageShell
        description="Доступ в CRM выдаётся владельцем или администратором салона. Клиентам аккаунт не нужен — они могут записаться онлайн без регистрации."
        eyebrow="доступ для сотрудников"
        title="Открытая регистрация отключена"
      >
        <div className="mx-auto max-w-2xl rounded-[32px] border border-taupe/25 bg-white/80 p-6 text-center shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <div className="flex justify-center">
            <StatusBadge tone="preview">регистрация закрыта</StatusBadge>
          </div>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-graphite/68">
            CRM предназначена для сотрудников: владельца, администратора и
            мастеров. Клиенты записываются быстрее: без аккаунта, только с
            именем и телефоном на этапе онлайн-записи.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-full bg-graphite px-5 text-sm font-bold text-porcelain transition hover:bg-plum"
            >
              Войти в CRM
            </Link>
            <Link
              href="/booking"
              className="inline-flex h-11 items-center justify-center rounded-full border border-champagne/45 px-5 text-sm font-bold text-plum transition hover:border-champagne hover:text-graphite"
            >
              Записаться онлайн
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-full border border-taupe/35 px-5 text-sm font-bold text-graphite/65 transition hover:text-graphite"
            >
              На главную
            </Link>
          </div>
        </div>
      </PageShell>
      <PublicFooter />
    </>
  );
}
