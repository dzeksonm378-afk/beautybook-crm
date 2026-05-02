"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { can, type Permission, type StaffRole } from "@/lib/admin/permissions";

const navItems = [
  { href: "/admin", label: "Обзор", permission: "viewDashboard" },
  { href: "/admin/clients", label: "Клиенты", permission: "manageClients" },
  { href: "/admin/appointments", label: "Записи", permission: "manageAppointments" },
  { href: "/admin/services", label: "Услуги", permission: "manageServices" },
  { href: "/admin/masters", label: "Мастера", permission: "manageMasters" },
  { href: "/admin/analytics", label: "Аналитика", permission: "viewAnalytics" },
  { href: "/admin/settings", label: "Настройки", permission: "viewSettings" },
] satisfies Array<{ href: string; label: string; permission: Permission }>;

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type DashboardSidebarProps = {
  role?: StaffRole | null;
  salonName?: string | null;
};

export function DashboardSidebar({ role, salonName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const displaySalonName = salonName ?? "BeautyBook";
  const displayRole = role ?? "CRM";
  const availableNavItems = role
    ? navItems.filter((item) => can(role, item.permission))
    : [];

  return (
    <aside className="border-white/8 flex min-h-fit flex-col border-b bg-[linear-gradient(180deg,var(--color-graphite),var(--color-plum))] p-4 text-porcelain sm:p-5 lg:sticky lg:top-0 lg:min-h-screen lg:border-b-0 lg:border-r">
      <Link href="/admin" className="mb-4 flex min-w-0 items-center gap-3 lg:mb-8">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-champagne/35 bg-champagne/10 font-display text-lg text-champagne lg:h-10 lg:w-10 lg:text-xl">
          B
        </span>
        <span className="min-w-0">
          <span className="block break-words font-display text-lg leading-tight lg:text-xl">
            {displaySalonName}
          </span>
          <span className="text-xs uppercase tracking-[0.26em] text-champagne">
            {displayRole}
          </span>
        </span>
      </Link>

      <nav className="grid grid-cols-2 gap-2 lg:block lg:space-y-2">
        {availableNavItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              href={item.href}
              key={item.href}
              className={`flex min-h-10 items-center justify-center gap-2 rounded-full px-3 py-2 text-center text-sm transition lg:justify-between lg:px-4 lg:py-3 ${
                active
                  ? "bg-champagne text-graphite shadow-[0_14px_40px_rgba(200,169,106,0.22)]"
                  : "text-porcelain/68 hover:bg-white/8 hover:text-porcelain"
              }`}
            >
              {item.label}
              {active ? <span className="h-2 w-2 rounded-full bg-lime" /> : null}
            </Link>
          );
        })}
        {availableNavItems.length === 0 ? (
          <p className="col-span-2 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-porcelain/68">
            Доступ к разделам CRM ограничен.
          </p>
        ) : null}
      </nav>

      <Link
        href="/"
        className="mt-3 rounded-full border border-white/10 px-4 py-2 text-center text-sm text-porcelain/75 transition hover:border-champagne/50 hover:text-champagne lg:mt-auto lg:py-3"
      >
        На сайт
      </Link>
    </aside>
  );
}
