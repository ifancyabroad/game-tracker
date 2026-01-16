import type { ILeaderboard, LeaderboardStatus } from "features/settings/types";

/**
 * Calculate the status of a leaderboard based on current date and date range
 * - "scheduled": Has a start date in the future
 * - "active": Currently running (no end date, or end date is in future)
 * - "complete": Has an end date in the past
 */
export function getLeaderboardStatus(leaderboard: ILeaderboard | null): LeaderboardStatus {
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
}

/**
 * Check if a leaderboard is complete (has ended)
 */
export function isLeaderboardComplete(leaderboard: ILeaderboard | null): boolean {
	return getLeaderboardStatus(leaderboard) === "complete";
}

/**
 * Check if a leaderboard is active
 */
export function isLeaderboardActive(leaderboard: ILeaderboard | null): boolean {
	return getLeaderboardStatus(leaderboard) === "active";
}

/**
 * Check if a leaderboard is scheduled (not yet started)
 */
export function isLeaderboardScheduled(leaderboard: ILeaderboard | null): boolean {
	return getLeaderboardStatus(leaderboard) === "scheduled";
}
