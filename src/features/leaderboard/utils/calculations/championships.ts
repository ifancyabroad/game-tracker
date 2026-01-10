import type { IEvent, IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";
import { computePlayerData, type LeaderboardFilters } from "features/players/utils/calculations";
import { getLeaderboard } from "./filtering";

/**
 * Calculate championships for a specific leaderboard configuration
 * For leaderboards with date ranges, returns a single champion
 * For permanent leaderboards (no date range), returns current #1
 */
export function getLeaderboardChampion(
	events: IEvent[],
	results: IResult[],
	players: IPlayer[],
	gameById: Map<string, IGame>,
	filters: LeaderboardFilters,
): { playerId: string; displayName: string } | null {
	const playerData = computePlayerData(players, results, gameById, events, filters);
	const leaderboard = getLeaderboard(playerData);

	if (leaderboard.length > 0) {
		const champion = leaderboard[0];
		return {
			playerId: champion.id,
			displayName: champion.data.name,
		};
	}

	return null;
}
