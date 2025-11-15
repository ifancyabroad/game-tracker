import type { IEvent, IResult } from "features/events/types";
import type { IGame } from "features/games/types";
import type { IPlayer } from "features/players/types";
import { getDisplayName } from "features/players/utils/helpers";
import { format, parseISO } from "date-fns";

export interface MostPlayedGames {
	name: string;
	count: number;
}
export interface TimeSeriesData {
	date: string;
	[key: string]: number | string;
}

export interface FeaturedStats {
	totalGamesPlayed: number;
	totalEvents: number;
	totalPlayersInvolved: number;
}

export function computeMostPlayedGames(results: IResult[], games: IGame[]): MostPlayedGames[] {
	const gameCount: Record<string, number> = {};
	results.forEach((r) => {
		gameCount[r.gameId] = (gameCount[r.gameId] || 0) + 1;
	});
	return Object.entries(gameCount)
		.map(([gameId, count]) => ({
			name: games.find((g) => g.id === gameId)?.name || "Unknown",
			count,
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, 8);
}

/**
 * Helper function to format event dates consistently
 */
function formatEventDate(event: IEvent): string {
	return format(parseISO(event.date), "MMM d");
}

export function computeGameTrendsOverTime(results: IResult[], games: IGame[], events: IEvent[]): TimeSeriesData[] {
	const dateMap: Record<string, Record<string, number>> = {};

	results.forEach((result) => {
		const event = events.find((e) => e.id === result.eventId);
		if (!event) return;

		const game = games.find((g) => g.id === result.gameId);
		if (!game) return;

		const formattedDate = formatEventDate(event);

		if (!dateMap[formattedDate]) {
			dateMap[formattedDate] = {};
		}
		dateMap[formattedDate][game.name] = (dateMap[formattedDate][game.name] || 0) + 1;
	});

	return Object.entries(dateMap)
		.map(([date, counts]) => ({ date, ...counts }))
		.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
}

export function computePlayerWinsOverTime(results: IResult[], players: IPlayer[], events: IEvent[]): TimeSeriesData[] {
	const dateMap: Record<string, Record<string, number>> = {};
	const cumulativeWins: Record<string, number> = {};

	// Sort events by date for cumulative calculation
	const sortedEvents = events.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	sortedEvents.forEach((event) => {
		const date = formatEventDate(event);
		if (!dateMap[date]) {
			dateMap[date] = {};
		}

		// Update cumulative wins for this event
		results
			.filter((r) => r.eventId === event.id)
			.forEach((result) => {
				result.playerResults.forEach((pr) => {
					if (pr.isWinner || pr.rank === 1) {
						cumulativeWins[pr.playerId] = (cumulativeWins[pr.playerId] || 0) + 1;
					}
				});
			});

		// Snapshot cumulative wins for all players at this date
		for (const playerId in cumulativeWins) {
			const player = players.find((p) => p.id === playerId);
			if (!player) continue;
			const name = getDisplayName(player);
			dateMap[date][name] = cumulativeWins[playerId];
		}
	});

	return Object.entries(dateMap)
		.map(([date, values]) => ({ date, ...values }))
		.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
}

export const getFeaturedStats = (results: IResult[], events: IEvent[]): FeaturedStats => {
	const totalGamesPlayed = results.length;
	const totalEvents = events.length;
	const totalPlayersInvolved = new Set(results.flatMap((r) => r.playerResults.map((pr) => pr.playerId))).size;
	return { totalGamesPlayed, totalEvents, totalPlayersInvolved };
};
