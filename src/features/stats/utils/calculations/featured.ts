import type { IEvent, IResult } from "features/events/types";
import type { FeaturedStats } from "features/stats/types";

/**
 * Count unique players from results
 */
function countUniquePlayers(results: IResult[]): number {
	return new Set(results.flatMap((r) => r.playerResults.map((pr) => pr.playerId))).size;
}

/**
 * Get featured statistics
 */
export const getFeaturedStats = (results: IResult[], events: IEvent[]): FeaturedStats => {
	return {
		totalGamesPlayed: results.length,
		totalEvents: events.length,
		totalPlayersInvolved: countUniquePlayers(results),
	};
};
