import type { ILeaderboard } from "features/settings/types";
import { getLeaderboardStatus } from "../helpers";

/**
 * Sort leaderboards by status (scheduled -> active -> complete),
 * then by dates, then alphabetically
 */
export function sortLeaderboards(leaderboards: ILeaderboard[]): ILeaderboard[] {
	return [...leaderboards].sort((a, b) => {
		const aStatus = getLeaderboardStatus(a);
		const bStatus = getLeaderboardStatus(b);

		// Status priority: scheduled (0) -> active (1) -> complete (2)
		const statusOrder = { scheduled: 0, active: 1, complete: 2 };
		const statusDiff = statusOrder[aStatus] - statusOrder[bStatus];
		if (statusDiff !== 0) return statusDiff;

		// Secondary sort by dates
		const aEndDate = a.endDate ? new Date(a.endDate).getTime() : Infinity;
		const bEndDate = b.endDate ? new Date(b.endDate).getTime() : Infinity;
		const aStartDate = a.startDate ? new Date(a.startDate).getTime() : 0;
		const bStartDate = b.startDate ? new Date(b.startDate).getTime() : 0;

		// For scheduled/active: sort by end date (soonest first), then start date
		if (aStatus !== "complete" && bStatus !== "complete") {
			if (aEndDate !== bEndDate) return aEndDate - bEndDate;
			if (aStartDate !== bStartDate) return aStartDate - bStartDate;
		}

		// For completed: sort by end date (most recent first)
		if (aStatus === "complete" && bStatus === "complete") {
			if (aEndDate !== bEndDate) return bEndDate - aEndDate; // Reverse for completed
		}

		// Tertiary sort alphabetically
		return a.name.localeCompare(b.name);
	});
}
