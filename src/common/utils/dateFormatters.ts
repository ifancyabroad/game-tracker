import { format, parseISO } from "date-fns";
import type { IEvent } from "features/events/types";

/**
 * Format event date consistently (MMM d format)
 */
export function formatEventDate(event: IEvent): string {
	return format(parseISO(event.date), "MMM d");
}

/**
 * Parse ISO date string to timestamp
 */
export function parseISOToTimestamp(dateString: string): number {
	return parseISO(dateString).getTime();
}
