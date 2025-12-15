import type { IEvent, IResult } from "features/events/types";

export function sortResults(results: IResult[], eventById: Map<string, IEvent>): IResult[] {
	return results.slice().sort((a, b) => {
		const eventA = eventById.get(a.eventId);
		const eventB = eventById.get(b.eventId);
		if (eventA && eventB) {
			const dateA = new Date(eventA.date).getTime();
			const dateB = new Date(eventB.date).getTime();
			return dateA === dateB ? a.order - b.order : dateA - dateB;
		} else if (eventA) {
			return -1;
		} else if (eventB) {
			return 1;
		}
		return 0;
	});
}

export function sortEvents(events: IEvent[]): IEvent[] {
	return events.slice().sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
}
