const moscowTimeZone = "Europe/Moscow";

function getMoscowDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: moscowTimeZone,
    year: "numeric",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return { day, month, year };
}

export function getTodayDateString() {
  const { day, month, year } = getMoscowDateParts();
  return `${year}-${month}-${day}`;
}

export function getMaxBookingDateString() {
  const today = getTodayDateString();
  const maxDate = new Date(`${today}T00:00:00+03:00`);
  maxDate.setMonth(maxDate.getMonth() + 12);
  const { day, month, year } = getMoscowDateParts(maxDate);

  return `${year}-${month}-${day}`;
}

export function getCurrentMonthRange() {
  const { month, year } = getMoscowDateParts();
  const start = `${year}-${month}-01`;
  const endDate = new Date(Number(year), Number(month), 0);
  const end = `${year}-${month}-${String(endDate.getDate()).padStart(2, "0")}`;

  return { end, start };
}

export function formatRuDate(date: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    timeZone: moscowTimeZone,
    year: "numeric",
  }).format(new Date(`${date}T00:00:00+03:00`));
}

export function formatShortTime(time: string) {
  return time.slice(0, 5);
}
