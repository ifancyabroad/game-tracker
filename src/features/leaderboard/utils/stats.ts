import type { PlayerStats } from "features/players/utils/stats";

export function sortLeaderboard(rows: PlayerStats[]) {
	return rows.sort((a, b) => {
		if (b.points !== a.points) return b.points - a.points;
		if (b.wins !== a.wins) return b.wins - a.wins;
		if (b.winRate !== a.winRate) return b.winRate - a.winRate;
		if (b.games !== a.games) return b.games - a.games;
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
}

export function getLeaderboard(playerStats: PlayerStats[]) {
	const playersWithGames = playerStats.filter((stats) => stats.games > 0);
	return sortLeaderboard(playersWithGames);
}

export function getMostPointsPlayer(leaderboard: PlayerStats[]) {
	if (leaderboard.length === 0) return undefined;
	return leaderboard.slice().sort((a, b) => b.points - a.points)[0];
}

export function getMostWinsPlayer(leaderboard: PlayerStats[]) {
	if (leaderboard.length === 0) return undefined;
	return leaderboard.slice().sort((a, b) => b.wins - a.wins)[0];
}

export function getBestWinRateMinGames(leaderboard: PlayerStats[], minGames: number) {
	const eligible = leaderboard.filter((r) => r.games >= minGames);
	if (eligible.length === 0) return undefined;
	return eligible.sort((a, b) => b.winRate - a.winRate || b.games - a.games)[0];
}

export function getFeaturedStats(leaderboard: PlayerStats[]) {
	const mostPoints = getMostPointsPlayer(leaderboard);
	const mostWins = getMostWinsPlayer(leaderboard);
	const bestWinRate = getBestWinRateMinGames(leaderboard, 5);
	return { mostPoints, mostWins, bestWinRate };
}
