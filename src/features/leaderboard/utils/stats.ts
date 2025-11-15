import type { PlayerStats } from "features/players/utils/stats";
import type { IPlayer } from "features/players/types";
import { getDisplayName } from "features/players/utils/helpers";

export interface PlayerLeaderboardRow {
	player: IPlayer;
	wins: number;
	games: number;
	winRate: number;
	points: number;
}

export function sortLeaderboard(rows: PlayerLeaderboardRow[]) {
	return rows.sort((a, b) => {
		if (b.points !== a.points) return b.points - a.points;
		if (b.wins !== a.wins) return b.wins - a.wins;
		if (b.winRate !== a.winRate) return b.winRate - a.winRate;
		if (b.games !== a.games) return b.games - a.games;
		const an = getDisplayName(a.player).toLowerCase();
		const bn = getDisplayName(b.player).toLowerCase();
		return an.localeCompare(bn);
	});
}

export function getLeaderboard(players: IPlayer[], statsMap: Map<string, PlayerStats>) {
	const playersWithStats = players
		.map((player) => ({
			player,
			...statsMap.get(player.id)!,
		}))
		.filter((r) => r.games > 0);
	return sortLeaderboard(playersWithStats);
}

export function getMostPointsPlayer(leaderboard: PlayerLeaderboardRow[]) {
	if (leaderboard.length === 0) return undefined;
	return leaderboard.slice().sort((a, b) => b.points - a.points)[0];
}

export function getMostWinsPlayer(leaderboard: PlayerLeaderboardRow[]) {
	if (leaderboard.length === 0) return undefined;
	return leaderboard.slice().sort((a, b) => b.wins - a.wins)[0];
}

export function getBestWinRateMinGames(leaderboard: PlayerLeaderboardRow[], minGames: number) {
	const eligible = leaderboard.filter((r) => r.games >= minGames);
	if (eligible.length === 0) return undefined;
	return eligible.sort((a, b) => b.winRate - a.winRate || b.games - a.games)[0];
}

export function getFeaturedStats(leaderboard: PlayerLeaderboardRow[]) {
	const mostPoints = getMostPointsPlayer(leaderboard);
	const mostWins = getMostWinsPlayer(leaderboard);
	const bestWinRate = getBestWinRateMinGames(leaderboard, 5);
	return { mostPoints, mostWins, bestWinRate };
}
