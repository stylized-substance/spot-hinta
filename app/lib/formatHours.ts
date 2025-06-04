import { DateTime } from "luxon";

export function formatHours(timestamp: DateTime): string {
  const startHour = timestamp.toFormat("HH:00");
  const endHour = timestamp.plus({ hours: 1 }).toFormat("HH:00");
  return `${startHour} - ${endHour}`;
}
