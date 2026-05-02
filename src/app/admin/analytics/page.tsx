import { AdminForbiddenState } from "@/components/admin/AdminAccessState";
import { PlaceholderCard } from "@/components/shared/PlaceholderCard";
import { getAdminPageAccess } from "@/lib/admin/guards";

const analytics = [
  ["Выручка", "386 000 ₽"],
  ["Завершённые записи", "118"],
  ["Популярные услуги", "Окрашивание"],
  ["Загрузка мастеров", "78%"],
  ["Неявки", "4.2%"],
  ["Повторные клиенты", "64%"],
];

export default async function AdminAnalyticsPage() {
  const access = await getAdminPageAccess("viewAnalytics");

  if (access.status !== "ready") {
    return <AdminForbiddenState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {analytics.map(([label, value]) => (
        <PlaceholderCard
          description="Без Recharts на этом этапе: только статичный preview будущей аналитики."
          key={label}
          title={value}
        >
          <p className="text-sm font-semibold text-plum/65">{label}</p>
        </PlaceholderCard>
      ))}
    </div>
  );
}
