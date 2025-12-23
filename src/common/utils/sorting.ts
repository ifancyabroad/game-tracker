import type { IEvent, IResult } from "features/events/types";

/**
 * Sort events chronologically by date
 * @param events - Events to sort
 * @param descending - If true, sorts newest first (default: false)
 */
export function sortEventsByDate(events: IEvent[], descending: boolean = false): IEvent[] {
	return events.slice().sort((a, b) => {
		const timeA = new Date(a.date).getTime();
		const timeB = new Date(b.date).getTime();
		return descending ? timeB - timeA : timeA - timeB;
	});
}

/**
 * Sort results chronologically by event date and order
 * @param results - Results to sort
 * @param eventById - Map of events by ID
 */
export function sortResultsChronologically(results: IResult[], eventById: Map<string, IEvent>): IResult[] {
	return results.slice().sort((a, b) => {
		const eventA = eventById.get(a.eventId);
		const eventB = eventById.get(b.eventId);

		// Both events should exist due to FK constraints, but handle gracefully
		if (!eventA || !eventB) {
			console.warn("Result with missing event detected:", !eventA ? a.eventId : b.eventId);
			return 0; // Keep original order if event is missing
		}

		const dateA = new Date(eventA.date).getTime();
		const dateB = new Date(eventB.date).getTime();
		return dateA === dateB ? a.order - b.order : dateA - dateB;
	});
}
