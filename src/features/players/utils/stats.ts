import type { IResult } from "features/events/types";
import type { IGame } from "features/games/types";

export interface PlayerEntry {
	resultId: string;
	gameId: string;
	isWinner: boolean | null;
	isLoser: boolean | null;
	rank: number | null;
}

export interface GameWinRateRow {
	gameId: string;
	name: string;
	games: number;
	wins: number;
	wr: number;
}

export interface PlayerAggregates {
	bestGame?: GameWinRateRow | undefined;
	mostPlayed?: GameWinRateRow | undefined;
	rankCounts: Array<{ rank: number; count: number }>;
	gameWinRates: GameWinRateRow[];
	lastGamesSeries: Array<{ x: number; wr: number }>;
}

export function getPlayerEntries(results: IResult[], playerId: string): PlayerEntry[] {
	const entries: PlayerEntry[] = [];
	for (const r of results) {
		for (const pr of r.playerResults) {
			if (pr.playerId === playerId) {
				entries.push({
					resultId: r.id,
					gameId: r.gameId,
					isWinner: pr.isWinner,
					isLoser: pr.isLoser,
					rank: pr.rank,
				});
			}
		}
	}
	return entries;
}

export function aggregatePlayerStatsForPage(
	results: IResult[],
	games: IGame[],
	playerId: string,
	opts: { bestGameMinSamples?: number; recentWindow?: number } = {},
): PlayerAggregates {
	const bestGameMinSamples = opts.bestGameMinSamples ?? 2;
	const recentWindow = opts.recentWindow ?? 20;

	const byGame: Record<string, { games: number; wins: number }> = {};
	const ranks: Record<number, number> = {};
	const lastSeries: { idx: number; cumWins: number; cumGames: number; wr: number }[] = [];

	let cumWins = 0;
	let cumGames = 0;

	const entries = getPlayerEntries(results, playerId);

	entries.forEach((e, i) => {
		cumGames++;
		if (e.isWinner || e.rank === 1) cumWins++;

		const rnk = Number.isFinite(e.rank as number) ? (e.rank as number) : -1;
		if (rnk > 0) ranks[rnk] = (ranks[rnk] ?? 0) + 1;

		byGame[e.gameId] = byGame[e.gameId] || { games: 0, wins: 0 };
		byGame[e.gameId].games++;
		if (e.isWinner || e.rank === 1) byGame[e.gameId].wins++;

		lastSeries.push({
			idx: i + 1,
			cumWins,
			cumGames,
			wr: cumGames ? Math.round((cumWins / cumGames) * 100) : 0,
		});
	});

	const gameWinRates: GameWinRateRow[] = Object.entries(byGame).map(([gameId, g]) => ({
		gameId,
		name: games.find((game) => game.id === gameId)?.name ?? "Unknown",
		games: g.games,
		wins: g.wins,
		wr: g.games ? g.wins / g.games : 0,
	}));

	const bestGame = gameWinRates
		.filter((g) => g.games >= bestGameMinSamples)
		.sort((a, b) => b.wr - a.wr || b.games - a.games)[0];

	const mostPlayed = gameWinRates.slice().sort((a, b) => b.games - a.games || b.wr - a.wr)[0];

	const rankCounts = Object.entries(ranks)
		.sort((a, b) => Number(a[0]) - Number(b[0]))
		.map(([rank, count]) => ({ rank: Number(rank), count }));

	const lastGamesSeries = lastSeries.slice(-recentWindow).map((p, i) => ({ x: i + 1, wr: p.wr }));

	return { bestGame, mostPlayed, rankCounts, gameWinRates, lastGamesSeries };
}
