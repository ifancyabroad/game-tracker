import { format } from "date-fns";
import type { ILeaderboard } from "features/settings/types";
import type { LeaderboardFilters } from "features/players/utils/calculations";

/**
 * Format a date range for display
 * @param startDate Optional start date ISO string
 * @param endDate Optional end date ISO string
 * @returns Formatted date range string or null if no dates
 */
export const formatDateRange = (startDate?: string, endDate?: string): string | null => {
	if (!startDate && !endDate) return null;

	if (startDate && endDate) {
		return `${format(new Date(startDate), "MMM d, yyyy")} - ${format(new Date(endDate), "MMM d, yyyy")}`;
	}

	if (startDate) {
		return `From ${format(new Date(startDate), "MMM d, yyyy")}`;
	}

	if (endDate) {
		return `Until ${format(new Date(endDate), "MMM d, yyyy")}`;
	}

	return null;
};

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
