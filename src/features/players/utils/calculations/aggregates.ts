import type { PlayerEntry, GameWinRateRow, PlayerAggregates } from "features/players/types";
import type { IGame } from "features/games/types";
import { isPlayerWinner } from "common/utils/gameHelpers";
import { calculateWinRatePercent } from "common/utils/calculations";

interface GameStatsAccumulator {
	games: number;
	wins: number;
}

interface WinRatePoint {
	idx: number;
	cumWins: number;
	cumGames: number;
	wr: number;
}

/**
 * Build game win rate statistics
 */
function buildGameWinRates(entries: PlayerEntry[], gameById: Map<string, IGame>): GameWinRateRow[] {
	const byGame: Record<string, GameStatsAccumulator> = {};

	entries.forEach((entry) => {
		if (!byGame[entry.gameId]) {
			byGame[entry.gameId] = { games: 0, wins: 0 };
		}

		byGame[entry.gameId].games++;
		if (isPlayerWinner(entry)) {
			byGame[entry.gameId].wins++;
		}
	});

	return Object.entries(byGame).map(([gameId, stats]) => {
		const game = gameById.get(gameId);
		return {
			gameId,
			name: game?.name ?? "Unknown",
			games: stats.games,
			wins: stats.wins,
			wr: stats.games ? stats.wins / stats.games : 0,
			points: (game?.points ?? 0) * stats.wins,
			color: game?.color ?? "#6366f1",
		};
	});
}

/**
 * Build rank distribution
 */
function buildRankCounts(entries: PlayerEntry[]): Array<{ rank: number; count: number }> {
	const ranks: Record<number, number> = {};

	entries.forEach((entry) => {
		const rank = Number.isFinite(entry.rank as number) ? (entry.rank as number) : -1;
		if (rank > 0) {
			ranks[rank] = (ranks[rank] ?? 0) + 1;
		}
	});

	return Object.entries(ranks)
		.sort((a, b) => Number(a[0]) - Number(b[0]))
		.map(([rank, count]) => ({ rank: Number(rank), count }));
}

/**
 * Build cumulative win rate series
 */
function buildWinRateSeries(entries: PlayerEntry[], recentWindow: number): WinRatePoint[] {
	const series: WinRatePoint[] = [];
	let cumWins = 0;
	let cumGames = 0;

	entries.forEach((entry, i) => {
		cumGames++;
		if (isPlayerWinner(entry)) cumWins++;

		series.push({
			idx: i + 1,
			cumWins,
			cumGames,
			wr: calculateWinRatePercent(cumWins, cumGames),
		});
	});

	return series.slice(-recentWindow);
}

/**
 * Find best game by win rate (minimum games required)
 */
function findBestGame(gameWinRates: GameWinRateRow[], minGames: number): GameWinRateRow | undefined {
	return gameWinRates.filter((g) => g.games >= minGames).sort((a, b) => b.wr - a.wr || b.games - a.games)[0];
}

/**
 * Find most played game
 */
function findMostPlayed(gameWinRates: GameWinRateRow[]): GameWinRateRow | undefined {
	return gameWinRates.slice().sort((a, b) => b.games - a.games || b.wr - a.wr)[0];
}

/**
 * Find game with most points earned
 */
function findMostPoints(gameWinRates: GameWinRateRow[]): GameWinRateRow | undefined {
	return gameWinRates.slice().sort((a, b) => b.points - a.points || b.wr - a.wr)[0];
}

/**
 * Aggregate player statistics for page display
 */
export function aggregatePlayerStatsForPage(
	entries: PlayerEntry[],
	gameById: Map<string, IGame>,
	opts: { bestGameMinSamples?: number; recentWindow?: number } = {},
): PlayerAggregates {
	const bestGameMinSamples = opts.bestGameMinSamples ?? 3;
	const recentWindow = opts.recentWindow ?? 20;

	const gameWinRates = buildGameWinRates(entries, gameById);
	const rankCounts = buildRankCounts(entries);
	const winRateSeries = buildWinRateSeries(entries, recentWindow);

	const bestGame = findBestGame(gameWinRates, bestGameMinSamples);
	const mostPlayed = findMostPlayed(gameWinRates);
	const mostPoints = findMostPoints(gameWinRates);

	const lastGamesSeries = winRateSeries.map((p, i) => ({
		x: i + 1,
		wr: p.wr,
	}));

	return {
		bestGame,
		mostPlayed,
		mostPoints,
		gameWinRates,
		rankCounts,
		lastGamesSeries,
	};
}
