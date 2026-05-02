import { AdminForbiddenState } from "@/components/admin/AdminAccessState";
import { getAdminPageAccess } from "@/lib/admin/guards";
import { updateSalonSettingsAction } from "@/lib/settings/actions";
import {
  defaultSalonWorkingHours,
  resolveWorkingHours,
  weekdayKeys,
  type WeekdayKey,
  type WorkingHoursForDay,
} from "@/lib/validations/settings.schema";
import { StatusBadge } from "@/components/shared/StatusBadge";

const errorMessages: Record<string, string> = {
  forbidden: "Только владелец может менять настройки салона.",
  update_failed: "Не удалось обновить настройки. Попробуйте ещё раз.",
  validation: "Проверьте название салона и рабочие часы.",
};

const weekdayLabels: Record<WeekdayKey, string> = {
  monday: "Понедельник",
  tuesday: "Вторник",
  wednesday: "Среда",
  thursday: "Четверг",
  friday: "Пятница",
  saturday: "Суббота",
  sunday: "Воскресенье",
};

const fallbackDayTime: WorkingHoursForDay = {
  from: "10:00",
  to: "18:00",
};

type AdminSettingsPageProps = {
  searchParams?: Promise<{
    error?: string;
    updated?: string;
  }>;
};

function getInputTime(day: WeekdayKey, value: WorkingHoursForDay | null) {
  return value ?? defaultSalonWorkingHours[day] ?? fallbackDayTime;
}

export default async function AdminSettingsPage({
  searchParams,
}: AdminSettingsPageProps) {
  const [access, params] = await Promise.all([
    getAdminPageAccess("manageSettings"),
    searchParams,
  ]);
  const updated = params?.updated === "1";
  const errorMessage = params?.error ? errorMessages[params.error] : null;

  if (access.status !== "ready") {
    return (
      <AdminForbiddenState
        title="Недостаточно прав для этого раздела"
        description="Настройки салона доступны только владельцу."
      />
    );
  }

  const { context } = access;
  const salon = context.salon;
  const workingHours = resolveWorkingHours(salon.working_hours);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <StatusBadge tone="gold">данные CRM</StatusBadge>
          <StatusBadge tone="preview">только владелец</StatusBadge>
          <StatusBadge tone="taupe">Europe/Moscow</StatusBadge>
        </div>
        <h1 className="font-display text-3xl leading-tight">Настройки салона</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-graphite/62">
          Профиль салона и рабочие часы. Этот график используется серверной
          проверкой при создании и редактировании записей.
        </p>

        {updated ? (
          <p className="mt-5 rounded-[20px] border border-lime/25 bg-lime/10 px-4 py-3 text-sm font-semibold text-graphite">
            Настройки салона обновлены.
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-5 rounded-[20px] border border-plum/15 bg-plum/5 px-4 py-3 text-sm font-semibold text-plum">
            {errorMessage}
          </p>
        ) : null}
      </section>

      <form action={updateSalonSettingsAction} className="space-y-6">
        <section className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
            профиль салона
          </p>
          <h2 className="font-display text-2xl leading-tight">Профиль салона</h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Название салона
              </span>
              <input
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white disabled:cursor-not-allowed disabled:bg-porcelain/35"
                defaultValue={salon.name}
                maxLength={80}
                minLength={2}
                name="name"
                required
                type="text"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Телефон
              </span>
              <input
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white disabled:cursor-not-allowed disabled:bg-porcelain/35"
                defaultValue={salon.phone ?? ""}
                maxLength={40}
                name="phone"
                placeholder="+7 812 000-00-00"
                type="tel"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                Адрес
              </span>
              <input
                className="mt-2 h-12 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-5 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white disabled:cursor-not-allowed disabled:bg-porcelain/35"
                defaultValue={salon.address ?? ""}
                maxLength={160}
                name="address"
                placeholder="Санкт-Петербург"
                type="text"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[28px] border border-taupe/25 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,19,31,0.08)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-plum/65">
            рабочие часы
          </p>
          <h2 className="font-display text-2xl leading-tight">Рабочие часы</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-graphite/62">
            Закрытый день сохраняется как null. Ночной график в MVP не
            поддерживается: время открытия должно быть раньше закрытия.
          </p>

          <div className="mt-6 grid gap-3">
            {weekdayKeys.map((day) => {
              const dayValue = workingHours[day];
              const inputTime = getInputTime(day, dayValue);

              return (
                <div
                  className="grid gap-4 rounded-[24px] border border-taupe/25 bg-white/60 p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"
                  key={day}
                >
                  <div>
                    <p className="font-semibold">{weekdayLabels[day]}</p>
                    <p className="mt-1 text-xs text-graphite/52">
                      {dayValue
                        ? `${dayValue.from}-${dayValue.to}`
                        : "Закрыто"}
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-3 text-sm font-semibold text-graphite/72">
                    <input
                      className="h-4 w-4 accent-plum"
                      defaultChecked={Boolean(dayValue)}
                      name={`${day}_open`}
                      type="checkbox"
                      value="1"
                    />
                    Открыто
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                      С
                    </span>
                    <input
                      className="mt-2 h-11 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-4 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white disabled:cursor-not-allowed disabled:bg-porcelain/35 sm:w-32 md:w-36"
                      defaultValue={inputTime.from}
                      name={`${day}_from`}
                      step={300}
                      type="time"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum/55">
                      До
                    </span>
                    <input
                      className="mt-2 h-11 w-full rounded-full border border-taupe/25 bg-porcelain/70 px-4 text-sm text-graphite outline-none transition focus:border-champagne focus:bg-white disabled:cursor-not-allowed disabled:bg-porcelain/35 sm:w-32 md:w-36"
                      defaultValue={inputTime.to}
                      name={`${day}_to`}
                      step={300}
                      type="time"
                    />
                  </label>
                </div>
              );
            })}
          </div>

          <button
            className="mt-6 h-12 w-full rounded-full bg-graphite px-6 text-sm font-bold text-porcelain transition hover:bg-plum disabled:cursor-not-allowed disabled:bg-graphite/45 sm:w-auto"
            type="submit"
          >
            Сохранить настройки
          </button>
        </section>
      </form>
    </div>
  );
}
