import { redirect } from "next/navigation";

export default function DashboardClientsLegacyPage() {
  redirect("/admin/clients");
}
