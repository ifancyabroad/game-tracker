import type { IEvent, IResult, IEventPlayerStat } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";
import { isPlayerWinner } from "common/utils/gameHelpers";
import { getDisplayName } from "features/players/utils/helpers";

/**
 * Get the top scorer(s) for an event
 * Returns a comma-separated string of player names who scored the most points
 */
export function getEventTopScorers(playerStats: IEventPlayerStat[], playerById: Map<string, IPlayer>): string {
	if (playerStats.length === 0) {
		return "N/A";
	}

	const maxPoints = Math.max(...playerStats.map((s) => s.points));

	if (maxPoints <= 0) {
		return "N/A";
	}

	const topScorers = playerStats
		.filter((s) => s.points === maxPoints)
		.map((s) => playerById.get(s.playerId))
		.filter(Boolean)
		.map((p) => getDisplayName(p!));

	return topScorers.length > 0 ? topScorers.join(", ") : "N/A";
}

/**
 * Calculate stats for a single player in an event
 */
function calculatePlayerStats(
	playerId: string,
	eventResults: IResult[],
	gameById: Map<string, IGame>,
): { wins: number; losses: number; gamesPlayed: number; points: number } {
	let wins = 0;
	let losses = 0;
	let gamesPlayed = 0;
	let points = 0;

	eventResults.forEach((result) => {
		const playerResult = result.playerResults.find((pr) => pr.playerId === playerId);
		if (playerResult) {
			const game = gameById.get(result.gameId);
			const gamePoints = game?.points || 0;
			gamesPlayed++;

			if (isPlayerWinner(playerResult)) {
				wins++;
				points += gamePoints;
			}
			if (playerResult.isLoser) {
				losses++;
				points -= gamePoints;
			}
		}
	});

	return { wins, losses, gamesPlayed, points };
}

/**
 * Get player statistics for an event
 */
export function getEventPlayerStats(
	event: IEvent,
	eventResults: IResult[],
	playerById: Map<string, IPlayer>,
	gameById: Map<string, IGame>,
): IEventPlayerStat[] {
	return event.playerIds.map((playerId) => {
		const player = playerById.get(playerId);
		const stats = calculatePlayerStats(playerId, eventResults, gameById);

		return {
			playerId,
			player,
			name: getDisplayName(player),
			...stats,
		};
	});
}

/**
 * Sort player stats by points (desc), wins (desc), then name (asc)
 */
export function sortEventPlayerStats(stats: IEventPlayerStat[]): IEventPlayerStat[] {
	return stats.slice().sort((a, b) => {
		if (b.points !== a.points) return b.points - a.points;
		if (b.wins !== a.wins) return b.wins - a.wins;
		return a.name.localeCompare(b.name);
	});
}

/**
 * Get and sort event player stats (convenience function)
 */
export function getSortedEventPlayerStats(
	eventId: string,
	eventById: Map<string, IEvent>,
	results: IResult[],
	playerById: Map<string, IPlayer>,
	gameById: Map<string, IGame>,
): IEventPlayerStat[] {
	const event = eventById.get(eventId);
	if (!event) return [];

	const eventResults = results.filter((r) => r.eventId === eventId);
	const stats = getEventPlayerStats(event, eventResults, playerById, gameById);
	return sortEventPlayerStats(stats);
}
