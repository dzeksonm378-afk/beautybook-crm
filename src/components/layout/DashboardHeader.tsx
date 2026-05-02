import { StatusBadge } from "@/components/shared/StatusBadge";
import { logoutAction } from "@/lib/auth/actions";
import type { AdminProfile, AdminSalon } from "@/lib/admin/context";

type DashboardHeaderProps = {
  profile?: AdminProfile | null;
  salon?: AdminSalon | null;
};

const roleLabel: Record<AdminProfile["role"], string> = {
  admin: "admin",
  master: "master",
  owner: "owner",
};

export function DashboardHeader({ profile, salon }: DashboardHeaderProps) {
  const salonName = salon?.name ?? "BeautyBook CRM";
  const staffName = profile?.full_name ?? "Сотрудник";

  return (
    <header className="flex flex-col gap-3 border-b border-taupe/20 bg-porcelain/85 px-4 py-4 backdrop-blur sm:px-8 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-plum/55">
          CRM для сотрудников
        </p>
        <h1 className="mt-1 break-words font-display text-2xl leading-tight text-graphite sm:text-3xl">
          {salonName}
        </h1>
        <p className="mt-1 break-words text-sm text-graphite/58">{staffName}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {profile ? (
          <StatusBadge tone="preview">{roleLabel[profile.role]}</StatusBadge>
        ) : (
          <StatusBadge tone="preview">staff access</StatusBadge>
        )}
        <StatusBadge tone="gold">Europe/Moscow</StatusBadge>
        <form action={logoutAction}>
          <button
            className="inline-flex h-9 items-center justify-center rounded-full border border-taupe/35 px-4 text-xs font-bold text-plum transition hover:border-champagne hover:text-graphite"
            type="submit"
          >
            Выйти
          </button>
        </form>
      </div>
    </header>
  );
}
