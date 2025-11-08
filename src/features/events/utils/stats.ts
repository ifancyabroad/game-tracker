import type { IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";
import { getDisplayName } from "features/players/utils/helpers";

export interface PlayerStats {
	points: number;
	wins: number;
	games: number;
	winRate: number;
}

export function getWinsForPlayer(results: IResult[], playerId: string): number {
	let wins = 0;
	for (const r of results) {
		for (const pr of r.playerResults) {
			if (pr.playerId === playerId) {
				if (pr.isWinner || pr.rank === 1) wins++;
			}
		}
	}
	return wins;
}

export function getGamesForPlayer(results: IResult[], playerId: string): number {
	let games = 0;
	for (const r of results) {
		for (const pr of r.playerResults) {
			if (pr.playerId === playerId) games++;
		}
	}
	return games;
}

export const getPointsForPlayer = (results: IResult[], games: IGame[], playerId: string): number => {
	let points = 0;
	for (const r of results) {
		for (const pr of r.playerResults) {
			if (pr.playerId === playerId) {
				const isWinner = pr.isWinner || pr.rank === 1;
				if (isWinner) {
					const game = games.find((g) => g.id === r.gameId);
					if (game) points += game.points;
				}
				if (pr.isLoser) {
					const game = games.find((g) => g.id === r.gameId);
					if (game) points -= game.points;
				}
			}
		}
	}
	return points;
};

export function buildWinsMap(results: IResult[]): Map<string, number> {
	const wins = new Map<string, number>();
	for (const r of results) {
		for (const pr of r.playerResults) {
			if (pr.isWinner || pr.rank === 1) {
				const current = wins.get(pr.playerId) ?? 0;
				wins.set(pr.playerId, current + 1);
			}
		}
	}
	return wins;
}

export function buildGamesMap(results: IResult[]): Map<string, number> {
	const games = new Map<string, number>();
	for (const r of results) {
		for (const pr of r.playerResults) {
			const current = games.get(pr.playerId) ?? 0;
			games.set(pr.playerId, current + 1);
		}
	}
	return games;
}

export const buildPointsMap = (results: IResult[], games: IGame[]): Map<string, number> => {
	const points = new Map<string, number>();
	for (const r of results) {
		for (const pr of r.playerResults) {
			if (pr.isWinner || pr.rank === 1) {
				const current = points.get(pr.playerId) ?? 0;
				const game = games.find((g) => g.id === r.gameId);
				if (game) points.set(pr.playerId, current + game.points);
			}
			if (pr.isLoser) {
				const current = points.get(pr.playerId) ?? 0;
				const game = games.find((g) => g.id === r.gameId);
				if (game) points.set(pr.playerId, current - game.points);
			}
		}
	}
	return points;
};

export function computePlayerStats(players: IPlayer[], results: IResult[], games: IGame[]): Map<string, PlayerStats> {
	const wins = buildWinsMap(results);
	const numGames = buildGamesMap(results);
	const points = buildPointsMap(results, games);
	const stats = new Map<string, PlayerStats>();
	for (const pl of players) {
		const w = wins.get(pl.id) ?? 0;
		const g = numGames.get(pl.id) ?? 0;
		const p = points.get(pl.id) ?? 0;
		const winRate = g > 0 ? w / g : 0;
		stats.set(pl.id, { wins: w, games: g, winRate, points: p });
	}
	return stats;
}

export function sortLeaderboard<
	T extends { player?: IPlayer; wins: number; games: number; winRate: number; points: number },
>(rows: T[]) {
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
