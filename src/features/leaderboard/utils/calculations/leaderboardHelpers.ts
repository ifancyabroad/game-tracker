import type { ILeaderboard } from "features/settings/types";
import type { LeaderboardFilters } from "features/players/utils/calculations";

/**
 * Get the default leaderboard from settings
 * Returns the first default leaderboard or the first leaderboard if no default is set
 */
export const getDefaultLeaderboard = (leaderboards: ILeaderboard[]): ILeaderboard | null => {
	if (!leaderboards || leaderboards.length === 0) return null;
	return leaderboards.find((lb) => lb.isDefault) || leaderboards[0];
};

/**
 * Get a specific leaderboard by ID
 */
export const getLeaderboardById = (leaderboards: ILeaderboard[], leaderboardId: string | null): ILeaderboard | null => {
	if (!leaderboardId || !leaderboards) return null;
	return leaderboards.find((lb) => lb.id === leaderboardId) || null;
};

/**
 * Convert leaderboard to filters
 */
export const leaderboardToFilters = (leaderboard: ILeaderboard | null): LeaderboardFilters => {
	if (!leaderboard) return {};

	return {
		gameTags: leaderboard.gameTags,
		playerIds: leaderboard.playerIds,
		startDate: leaderboard.startDate,
		endDate: leaderboard.endDate,
	};
};
