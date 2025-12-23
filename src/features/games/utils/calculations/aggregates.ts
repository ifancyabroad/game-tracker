import type { IResult } from "features/events/types";
import type { IEvent } from "features/events/types";
import { format, parseISO } from "date-fns";

/**
 * Build event play counts map (keyed by event ID)
 */
function buildEventPlayCounts(gameResults: IResult[]): Record<string, number> {
	const eventPlayCounts: Record<string, number> = {};
	gameResults.forEach((result) => {
		eventPlayCounts[result.eventId] = (eventPlayCounts[result.eventId] || 0) + 1;
	});
	return eventPlayCounts;
}

/**
 * Get events that include a specific game, sorted by date
 */
function getEventsWithGame(eventById: Map<string, IEvent>, gameId: string): IEvent[] {
	return Array.from(eventById.values())
		.filter((event) => event.gameIds?.includes(gameId))
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Get all events from a specific date onwards, sorted by date
 */
function getEventsFromDate(eventById: Map<string, IEvent>, startDate: Date): IEvent[] {
	return Array.from(eventById.values())
		.filter((event) => new Date(event.date) >= startDate)
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Compute play frequency time series for a game
 */
export function computePlayFrequency(
	gameResults: IResult[],
	eventById: Map<string, IEvent>,
): Array<{ date: string; plays: number }> {
	if (gameResults.length === 0) {
		return [];
	}

	const gameId = gameResults[0].gameId;
	const eventsWithGame = getEventsWithGame(eventById, gameId);

	if (eventsWithGame.length === 0) {
		return [];
	}

	const firstGameEventDate = new Date(eventsWithGame[0].date);
	const allEventsFromFirstPlay = getEventsFromDate(eventById, firstGameEventDate);
	const eventPlayCounts = buildEventPlayCounts(gameResults);

	return allEventsFromFirstPlay.map((event) => {
		const dateKey = format(parseISO(event.date), "MMM d");
		const plays = eventPlayCounts[event.id] || 0;
		return { date: dateKey, plays };
	});
}

/**
 * Compute rank distribution from game results
 */
export function computeRankDistribution(gameResults: IResult[]): Array<{ rank: number; count: number }> {
	const rankCounts: Record<number, number> = {};

	gameResults.forEach((result) => {
		result.playerResults.forEach((pr) => {
			if (pr.rank !== null && Number.isFinite(pr.rank)) {
				rankCounts[pr.rank] = (rankCounts[pr.rank] || 0) + 1;
			}
		});
	});

	return Object.entries(rankCounts)
		.map(([rank, count]) => ({ rank: Number(rank), count }))
		.sort((a, b) => a.rank - b.rank);
}
