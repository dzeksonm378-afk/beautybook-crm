import { z } from "zod";

export const weekdayKeys = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type WeekdayKey = (typeof weekdayKeys)[number];
export type WorkingHoursForDay = {
  from: string;
  to: string;
};
export type WorkingHoursJson = Record<WeekdayKey, WorkingHoursForDay | null>;

export const defaultSalonWorkingHours: WorkingHoursJson = {
  monday: { from: "10:00", to: "20:00" },
  tuesday: { from: "10:00", to: "20:00" },
  wednesday: { from: "10:00", to: "20:00" },
  thursday: { from: "10:00", to: "20:00" },
  friday: { from: "10:00", to: "20:00" },
  saturday: { from: "10:00", to: "18:00" },
  sunday: null,
};

type WorkingHoursInputDay = {
  open: boolean;
  from: string;
  to: string;
};

type WorkingHoursInput = Record<WeekdayKey, WorkingHoursInputDay>;

const timePattern = /^\d{2}:\d{2}$/;

function emptyToUndefined(value: unknown) {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}

function timeToMinutes(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWorkingHoursForDay(value: unknown): value is WorkingHoursForDay {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.from === "string" &&
    typeof value.to === "string" &&
    timePattern.test(value.from) &&
    timePattern.test(value.to) &&
    timeToMinutes(value.from) < timeToMinutes(value.to)
  );
}

const workingHoursDaySchema = z.object({
  open: z.boolean(),
  from: z.string().trim(),
  to: z.string().trim(),
});

const workingHoursSchema = z
  .object({
    monday: workingHoursDaySchema,
    tuesday: workingHoursDaySchema,
    wednesday: workingHoursDaySchema,
    thursday: workingHoursDaySchema,
    friday: workingHoursDaySchema,
    saturday: workingHoursDaySchema,
    sunday: workingHoursDaySchema,
  })
  .superRefine((workingHours, context) => {
    weekdayKeys.forEach((day) => {
      const value = workingHours[day];

      if (!value.open) {
        return;
      }

      if (!timePattern.test(value.from)) {
        context.addIssue({
          code: "custom",
          message: "Укажите время открытия.",
          path: [day, "from"],
        });
      }

      if (!timePattern.test(value.to)) {
        context.addIssue({
          code: "custom",
          message: "Укажите время закрытия.",
          path: [day, "to"],
        });
      }

      if (
        timePattern.test(value.from) &&
        timePattern.test(value.to) &&
        timeToMinutes(value.from) >= timeToMinutes(value.to)
      ) {
        context.addIssue({
          code: "custom",
          message: "Время открытия должно быть раньше закрытия.",
          path: [day, "to"],
        });
      }
    });
  });

export const salonSettingsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Введите название салона.")
    .max(80, "Название салона слишком длинное."),
  phone: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(40, "Телефон слишком длинный.").optional(),
  ),
  address: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(160, "Адрес слишком длинный.").optional(),
  ),
  workingHours: workingHoursSchema,
});

export type SalonSettingsInput = z.infer<typeof salonSettingsSchema>;

export function normalizeWorkingHours(
  workingHours: WorkingHoursInput,
): WorkingHoursJson {
  return weekdayKeys.reduce((result, day) => {
    const value = workingHours[day];

    return {
      ...result,
      [day]: value.open ? { from: value.from, to: value.to } : null,
    };
  }, {} as WorkingHoursJson);
}

export function resolveWorkingHours(value: unknown): WorkingHoursJson {
  if (!isRecord(value)) {
    return defaultSalonWorkingHours;
  }

  return weekdayKeys.reduce((result, day) => {
    const rawDay = value[day];

    if (rawDay === null) {
      return { ...result, [day]: null };
    }

    if (isWorkingHoursForDay(rawDay)) {
      return { ...result, [day]: rawDay };
    }

    return { ...result, [day]: defaultSalonWorkingHours[day] };
  }, {} as WorkingHoursJson);
}
