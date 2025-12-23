import type { PlayerWithData } from "features/players/types";

/**
 * Get player with most points from leaderboard
 */
export function getMostPointsPlayer(leaderboard: PlayerWithData[]): PlayerWithData | undefined {
	if (leaderboard.length === 0) return undefined;
	return leaderboard.slice().sort((a, b) => b.data.points - a.data.points)[0];
}

/**
 * Get player with most wins from leaderboard
 */
export function getMostWinsPlayer(leaderboard: PlayerWithData[]): PlayerWithData | undefined {
	if (leaderboard.length === 0) return undefined;
	return leaderboard.slice().sort((a, b) => b.data.wins - a.data.wins)[0];
}

/**
 * Get player with best win rate (minimum games required)
 */
export function getBestWinRateMinGames(leaderboard: PlayerWithData[], minGames: number): PlayerWithData | undefined {
	const eligible = leaderboard.filter((r) => r.data.games >= minGames);
	if (eligible.length === 0) return undefined;
	return eligible.sort((a, b) => b.data.winRate - a.data.winRate || b.data.games - a.data.games)[0];
}

/**
 * Get featured statistics from leaderboard
 */
export function getFeaturedStats(leaderboard: PlayerWithData[]) {
	const mostPoints = getMostPointsPlayer(leaderboard);
	const mostWins = getMostWinsPlayer(leaderboard);
	const bestWinRate = getBestWinRateMinGames(leaderboard, 5);
	return { mostPoints, mostWins, bestWinRate };
}
