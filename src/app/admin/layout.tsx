import { redirect } from "next/navigation";

import { getAdminContext } from "@/lib/admin/context";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { PlaceholderCard } from "@/components/shared/PlaceholderCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminContext = await getAdminContext();

  if (adminContext.status === "unauthenticated") {
    redirect("/login?reason=staff_only");
  }

  if (adminContext.status === "profileMissing") {
    return (
      <div className="min-h-screen bg-porcelain text-graphite lg:grid lg:grid-cols-[280px_1fr]">
        <DashboardSidebar />
        <div className="min-w-0">
          <DashboardHeader />
          <main className="px-4 py-5 sm:px-8 sm:py-6">
            <PlaceholderCard
              eyebrow="staff access"
              title="Профиль сотрудника не настроен"
              description="Доступ в CRM найден, но profile row отсутствует. Обратитесь к владельцу салона или администратору."
            >
              <StatusBadge tone="preview">profile required</StatusBadge>
            </PlaceholderCard>
          </main>
        </div>
      </div>
    );
  }

  if (adminContext.status === "salonMissing") {
    return (
      <div className="min-h-screen bg-porcelain text-graphite lg:grid lg:grid-cols-[280px_1fr]">
        <DashboardSidebar role={adminContext.profile.role} />
        <div className="min-w-0">
          <DashboardHeader profile={adminContext.profile} />
          <main className="px-4 py-5 sm:px-8 sm:py-6">
            <PlaceholderCard
              eyebrow="salon access"
              title="Салон не настроен"
              description="Профиль сотрудника найден, но salon row недоступен. Проверьте таблицу salons и RLS-политики."
            >
              <StatusBadge tone="preview">salon required</StatusBadge>
            </PlaceholderCard>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain text-graphite lg:grid lg:grid-cols-[280px_1fr]">
      <DashboardSidebar
        role={adminContext.profile.role}
        salonName={adminContext.salon.name}
      />
      <div className="min-w-0">
        <DashboardHeader profile={adminContext.profile} salon={adminContext.salon} />
        <main className="px-4 py-5 sm:px-8 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
