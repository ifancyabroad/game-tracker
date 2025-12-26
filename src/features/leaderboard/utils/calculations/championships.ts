import type { IEvent, IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame, GameType } from "features/games/types";
import { getAvailableYears, filterResultsByYear } from "common/utils/yearFilter";
import { computePlayerData } from "features/players/utils/calculations";
import { getLeaderboard } from "./filtering";

/**
 * Calculate championship years for each player based on yearly leaderboard rankings
 * Returns a map of playerId to array of years they finished in 1st place
 * Excludes the current year as rankings are not yet final
 */
export function getPlayerChampionships(
	events: IEvent[],
	results: IResult[],
	players: IPlayer[],
	gameById: Map<string, IGame>,
	gameType?: GameType,
): Map<string, number[]> {
	const championshipMap = new Map<string, number[]>();
	const currentYear = new Date().getFullYear();
	const availableYears = getAvailableYears(events);

	// Filter out current year - only concluded years count
	const concludedYears = availableYears.filter((year) => year < currentYear);

	// Calculate champion for each concluded year
	concludedYears.forEach((year) => {
		const yearResults = filterResultsByYear(results, events, year);

		// Calculate leaderboard for this specific year
		const playerData = computePlayerData(players, yearResults, gameById, events, gameType);
		const leaderboard = getLeaderboard(playerData);

		// Get the champion (rank 1 player)
		if (leaderboard.length > 0) {
			const champion = leaderboard[0];
			const championYears = championshipMap.get(champion.id) || [];
			championYears.push(year);
			championshipMap.set(champion.id, championYears);
		}
	});

	return championshipMap;
}
