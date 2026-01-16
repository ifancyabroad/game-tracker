import { format } from "date-fns";
import type { ILeaderboard, LeaderboardStatus } from "features/settings/types";

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
 * Calculate the status of a leaderboard based on current date and date range
 * - "scheduled": Has a start date in the future
 * - "active": Currently running (no end date, or end date is in future)
 * - "complete": Has an end date in the past
 */
export const getLeaderboardStatus = (leaderboard: ILeaderboard | null): LeaderboardStatus => {
	if (!leaderboard) {
		return "active"; // Default leaderboards are always active
	}

	const now = new Date();

	// Check if leaderboard has an end date and it's in the past
	if (leaderboard.endDate) {
		const endDate = new Date(leaderboard.endDate);
		if (now > endDate) {
			return "complete";
		}
	}

	// Check if leaderboard has a start date in the future
	if (leaderboard.startDate) {
		const startDate = new Date(leaderboard.startDate);
		if (now < startDate) {
			return "scheduled";
		}
	}

	// Otherwise, it's currently active
	return "active";
};

/**
 * Check if a leaderboard is complete (has ended)
 */
export const isLeaderboardComplete = (leaderboard: ILeaderboard | null): boolean => {
	return getLeaderboardStatus(leaderboard) === "complete";
};

/**
 * Check if a leaderboard is active
 */
export const isLeaderboardActive = (leaderboard: ILeaderboard | null): boolean => {
	return getLeaderboardStatus(leaderboard) === "active";
};

/**
 * Check if a leaderboard is scheduled (not yet started)
 */
export const isLeaderboardScheduled = (leaderboard: ILeaderboard | null): boolean => {
	return getLeaderboardStatus(leaderboard) === "scheduled";
};
