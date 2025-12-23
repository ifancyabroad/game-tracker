import type { PlayerWithData } from "features/players/types";
import { STATS_THRESHOLDS } from "common/utils/constants";

export function sortLeaderboard(rows: PlayerWithData[]) {
	return rows.sort((a, b) => {
		if (b.data.points !== a.data.points) return b.data.points - a.data.points;
		if (b.data.wins !== a.data.wins) return b.data.wins - a.data.wins;
		if (b.data.winRate !== a.data.winRate) return b.data.winRate - a.data.winRate;
		if (b.data.games !== a.data.games) return b.data.games - a.data.games;
		return a.data.name.toLowerCase().localeCompare(b.data.name.toLowerCase());
	});
}

export function getLeaderboard(players: PlayerWithData[]) {
	const playersWithGames = players.filter(
		(player) => player.data.games >= STATS_THRESHOLDS.MIN_GAMES_FOR_LEADERBOARD,
	);
	return sortLeaderboard(playersWithGames);
}

export function getMostPointsPlayer(leaderboard: PlayerWithData[]) {
	if (leaderboard.length === 0) return undefined;
	return leaderboard.slice().sort((a, b) => b.data.points - a.data.points)[0];
}

export function getMostWinsPlayer(leaderboard: PlayerWithData[]) {
	if (leaderboard.length === 0) return undefined;
	return leaderboard.slice().sort((a, b) => b.data.wins - a.data.wins)[0];
}

export function getBestWinRateMinGames(leaderboard: PlayerWithData[], minGames: number) {
	const eligible = leaderboard.filter((r) => r.data.games >= minGames);
	if (eligible.length === 0) return undefined;
	return eligible.sort((a, b) => b.data.winRate - a.data.winRate || b.data.games - a.data.games)[0];
}

export function getFeaturedStats(leaderboard: PlayerWithData[]) {
	const mostPoints = getMostPointsPlayer(leaderboard);
	const mostWins = getMostWinsPlayer(leaderboard);
	const bestWinRate = getBestWinRateMinGames(leaderboard, 5);
	return { mostPoints, mostWins, bestWinRate };
}
