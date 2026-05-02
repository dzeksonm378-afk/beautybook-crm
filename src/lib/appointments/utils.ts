import type { AppointmentStatus } from "@/lib/validations/appointment.schema";
import { getMaxBookingDateString, getTodayDateString } from "@/lib/date";

const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: "Запланирована",
  completed: "Завершена",
  cancelled: "Отменена",
  no_show: "Не пришёл",
};

type WorkingHoursForDay = {
  from: string;
  to: string;
};

type WeekdayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

const weekdayKeys: Record<string, WeekdayKey> = {
  Monday: "monday",
  Tuesday: "tuesday",
  Wednesday: "wednesday",
  Thursday: "thursday",
  Friday: "friday",
  Saturday: "saturday",
  Sunday: "sunday",
};

const defaultWorkingHours: Record<WeekdayKey, WorkingHoursForDay | null> = {
  monday: { from: "10:00", to: "20:00" },
  tuesday: { from: "10:00", to: "20:00" },
  wednesday: { from: "10:00", to: "20:00" },
  thursday: { from: "10:00", to: "20:00" },
  friday: { from: "10:00", to: "20:00" },
  saturday: { from: "10:00", to: "18:00" },
  sunday: null,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function timeToMinutes(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

export function calculateEndTime(startTime: string, durationMinutes: number) {
  return minutesToTime(timeToMinutes(startTime) + durationMinutes);
}

export function timesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string,
) {
  return timeToMinutes(startA) < timeToMinutes(endB)
    && timeToMinutes(endA) > timeToMinutes(startB);
}

export function isStartBeforeEnd(startTime: string, endTime: string) {
  return timeToMinutes(startTime) < timeToMinutes(endTime);
}

export function isValidTimeString(time: string) {
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
    return false;
  }

  const [hours = "", minutes = "", seconds = "00"] = time.split(":");
  const parsedHours = Number(hours);
  const parsedMinutes = Number(minutes);
  const parsedSeconds = Number(seconds);

  return Number.isInteger(parsedHours)
    && Number.isInteger(parsedMinutes)
    && Number.isInteger(parsedSeconds)
    && parsedHours >= 0
    && parsedHours <= 23
    && parsedMinutes >= 0
    && parsedMinutes <= 59
    && parsedSeconds >= 0
    && parsedSeconds <= 59;
}

export function isValidDateString(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00+03:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Moscow",
    year: "numeric",
  }).formatToParts(parsedDate);
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";

  return date === `${year}-${month}-${day}`;
}

export function isDateInBookingRange(date: string) {
  if (!isValidDateString(date)) {
    return false;
  }

  return date >= getTodayDateString() && date <= getMaxBookingDateString();
}

function getWeekdayKey(date: string): WeekdayKey | null {
  if (!isValidDateString(date)) {
    return null;
  }

  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Moscow",
    weekday: "long",
  }).format(new Date(`${date}T00:00:00+03:00`));

  return weekdayKeys[weekday] ?? null;
}

function parseWorkingHoursForDay(value: unknown): WorkingHoursForDay | null {
  if (!isRecord(value)) {
    return null;
  }

  const from = typeof value.from === "string" ? value.from : "";
  const to = typeof value.to === "string" ? value.to : "";

  if (!isValidTimeString(from) || !isValidTimeString(to)) {
    return null;
  }

  return { from, to };
}

export function getWorkingHoursForDate(date: string, workingHours: unknown) {
  const weekdayKey = getWeekdayKey(date);

  if (!weekdayKey) {
    return null;
  }

  if (!isRecord(workingHours)) {
    return defaultWorkingHours[weekdayKey];
  }

  if (!(weekdayKey in workingHours)) {
    return defaultWorkingHours[weekdayKey];
  }

  const rawDay = workingHours[weekdayKey];

  if (rawDay === null) {
    return null;
  }

  return parseWorkingHoursForDay(rawDay);
}

export function isWithinWorkingHours(
  startTime: string,
  endTime: string,
  workingHoursForDay: WorkingHoursForDay | null,
) {
  if (!workingHoursForDay) {
    return false;
  }

  return timeToMinutes(startTime) >= timeToMinutes(workingHoursForDay.from)
    && timeToMinutes(endTime) <= timeToMinutes(workingHoursForDay.to);
}

export function formatAppointmentStatus(status: AppointmentStatus) {
  return statusLabels[status];
}

export function normalizeTimeForPostgres(time: string) {
  return time.length === 5 ? `${time}:00` : time;
}
