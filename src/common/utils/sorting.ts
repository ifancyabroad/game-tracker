import type { IEvent, IResult } from "features/events/types";
import type { PlayerWithData } from "features/players/types";

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

/**
 * Sort leaderboard by points, wins, win rate, games played, then name
 * @param players - Players to sort
 */
export function sortLeaderboard(players: PlayerWithData[]): PlayerWithData[] {
	return players.slice().sort((a, b) => {
		if (b.data.points !== a.data.points) return b.data.points - a.data.points;
		if (b.data.wins !== a.data.wins) return b.data.wins - a.data.wins;
		if (b.data.winRate !== a.data.winRate) return b.data.winRate - a.data.winRate;
		if (b.data.games !== a.data.games) return b.data.games - a.data.games;
		return a.data.name.toLowerCase().localeCompare(b.data.name.toLowerCase());
	});
}
