import type { IEvent, IResult, IEventGameStat } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";
import { isPlayerWinner } from "common/utils/gameHelpers";

/**
 * Extract winners from game results
 */
function extractWinners(gameResults: IResult[], playerById: Map<string, IPlayer>): (IPlayer | undefined)[] {
	return gameResults
		.flatMap((result) => {
			const winningResults = result.playerResults.filter(isPlayerWinner);
			return winningResults.map((pr) => playerById.get(pr.playerId));
		})
		.filter(Boolean);
}

/**
 * Extract losers from game results
 */
function extractLosers(gameResults: IResult[], playerById: Map<string, IPlayer>): (IPlayer | undefined)[] {
	return gameResults
		.flatMap((result) => {
			const losingResults = result.playerResults.filter((pr) => pr.isLoser);
			return losingResults.map((pr) => playerById.get(pr.playerId));
		})
		.filter(Boolean);
}

/**
 * Get game statistics for an event
 */
export function getEventGameStats(
	event: IEvent,
	eventResults: IResult[],
	gameById: Map<string, IGame>,
	playerById: Map<string, IPlayer>,
): IEventGameStat[] {
	return event.gameIds.map((gameId) => {
		const game = gameById.get(gameId);
		const gameResults = eventResults.filter((r) => r.gameId === gameId);
		const timesPlayed = gameResults.length;
		const winners = extractWinners(gameResults, playerById);
		const losers = extractLosers(gameResults, playerById);

		return {
			gameId,
			game,
			name: game?.name || "Unknown",
			timesPlayed,
			winners,
			losers,
		};
	});
}

/**
 * Sort game stats by times played (desc), then name (asc)
 */
export function sortEventGameStats(stats: IEventGameStat[]): IEventGameStat[] {
	return stats.slice().sort((a, b) => {
		if (b.timesPlayed !== a.timesPlayed) return b.timesPlayed - a.timesPlayed;
		return a.name.localeCompare(b.name);
	});
}

/**
 * Get and sort event game stats (convenience function)
 */
export function getSortedEventGameStats(
	eventId: string,
	eventById: Map<string, IEvent>,
	results: IResult[],
	gameById: Map<string, IGame>,
	playerById: Map<string, IPlayer>,
): IEventGameStat[] {
	const event = eventById.get(eventId);
	if (!event) return [];

	const eventResults = results.filter((r) => r.eventId === eventId);
	const stats = getEventGameStats(event, eventResults, gameById, playerById);
	return sortEventGameStats(stats);
}
