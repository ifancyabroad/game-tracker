import type { IEvent, IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";

export interface PlayerStats {
	points: number;
	wins: number;
	games: number;
	winRate: number;
}

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

export function sortResults(results: IResult[], eventById: Map<string, IEvent>): IResult[] {
	return results.slice().sort((a, b) => {
		const eventA = eventById.get(a.eventId);
		const eventB = eventById.get(b.eventId);
		if (eventA && eventB) {
			const dateA = new Date(eventA.date).getTime();
			const dateB = new Date(eventB.date).getTime();
			return dateA === dateB ? a.order - b.order : dateA - dateB;
		} else if (eventA) {
			return -1;
		} else if (eventB) {
			return 1;
		}
		return 0;
	});
}
