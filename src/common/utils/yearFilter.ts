import type { IEvent, IResult } from "features/events/types";

/**
 * Extract unique years from events, sorted in descending order
 */
export const getAvailableYears = (events: IEvent[]): number[] => {
	const years = new Set<number>();
	events.forEach((event) => {
		const year = new Date(event.date).getFullYear();
		if (!isNaN(year)) {
			years.add(year);
		}
	});
	return Array.from(years).sort((a, b) => b - a);
};

/**
 * Get the most recent year from events, or null if no events
 */
export const getMostRecentYear = (events: IEvent[]): number | null => {
	const years = getAvailableYears(events);
	return years.length > 0 ? years[0] : null;
};

/**
 * Filter events by selected year (null = all years)
 */
export const filterEventsByYear = (events: IEvent[], year: number | null): IEvent[] => {
	if (year === null) {
		return events;
	}
	return events.filter((event) => {
		const eventYear = new Date(event.date).getFullYear();
		return eventYear === year;
	});
};

/**
 * Filter results by selected year based on event dates (null = all years)
 */
export const filterResultsByYear = (results: IResult[], events: IEvent[], year: number | null): IResult[] => {
	if (year === null) {
		return results;
	}

	// Create a set of event IDs that match the selected year
	const eventIdsInYear = new Set(
		events.filter((event) => new Date(event.date).getFullYear() === year).map((event) => event.id),
	);

	return results.filter((result) => eventIdsInYear.has(result.eventId));
};
