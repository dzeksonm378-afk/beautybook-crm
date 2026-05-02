import { PlaceholderCard } from "@/components/shared/PlaceholderCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

type AdminAccessStateProps = {
  title?: string;
  description?: string;
};

export function AdminForbiddenState({
  title = "Недостаточно прав для этого раздела",
  description = "Данные не загружены. Обратитесь к владельцу салона, если вам нужен доступ.",
}: AdminAccessStateProps) {
  return (
    <PlaceholderCard eyebrow="access control" title={title} description={description}>
      <StatusBadge tone="danger">forbidden</StatusBadge>
    </PlaceholderCard>
  );
}

export function MasterModeState() {
  return (
    <PlaceholderCard
      eyebrow="master mode"
      title="Режим мастера будет добавлен позже"
      description="Обратитесь к владельцу салона."
    >
      <StatusBadge tone="preview">limited access</StatusBadge>
    </PlaceholderCard>
  );
}
