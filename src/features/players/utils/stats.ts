import type { IPlayerResult, IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { GameType, IGame } from "features/games/types";
import { getColorForPlayer, getDisplayName, getFullName } from "./helpers";
import { isPlayerWinner } from "common/utils/gameHelpers";
import { calculateWinRate, calculateWinRatePercent } from "common/utils/calculations";

export interface PlayerData {
	playerId: string;
	name: string;
	fullName: string;
	color: string;
	points: number;
	wins: number;
	games: number;
	winRate: number; // Decimal (0-1)
	winRatePercent: number; // Percentage (0-100)
}

export interface PlayerWithData extends IPlayer {
	data: PlayerData;
}

export interface PlayerEntry {
	resultId: string;
	gameId: string;
	isWinner: boolean | null;
	isLoser: boolean | null;
	rank: number | null;
	opponents: string[];
}

export interface GameWinRateRow {
	gameId: string;
	name: string;
	games: number;
	wins: number;
	wr: number;
	points: number;
	color: string;
}

export interface PlayerAggregates {
	bestGame?: GameWinRateRow | undefined;
	mostPlayed?: GameWinRateRow | undefined;
	mostPoints?: GameWinRateRow | undefined;
	gameWinRates: GameWinRateRow[];
	rankCounts: Array<{ rank: number; count: number }>;
	lastGamesSeries: Array<{ x: number; wr: number }>;
}

export interface TopOpponent {
	opponentId: string;
	name: string;
	games: number;
	wins: number;
	losses: number;
}

export interface PlayerStreaks {
	longestWinStreak: number;
	longestLossStreak: number;
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
					opponents: r.playerResults.filter((opr) => opr.playerId !== playerId).map((opr) => opr.playerId),
				});
			}
		}
	}
	return entries;
}

export function aggregatePlayerStatsForPage(
	entries: PlayerEntry[],
	gameById: Map<string, IGame>,
	opts: { bestGameMinSamples?: number; recentWindow?: number } = {},
): PlayerAggregates {
	const bestGameMinSamples = opts.bestGameMinSamples ?? 3;
	const recentWindow = opts.recentWindow ?? 20;

	const byGame: Record<string, { games: number; wins: number }> = {};
	const ranks: Record<number, number> = {};
	const lastSeries: { idx: number; cumWins: number; cumGames: number; wr: number }[] = [];

	let cumWins = 0;
	let cumGames = 0;

	entries.forEach((e, i) => {
		cumGames++;
		if (isPlayerWinner(e)) cumWins++;

		const rnk = Number.isFinite(e.rank as number) ? (e.rank as number) : -1;
		if (rnk > 0) ranks[rnk] = (ranks[rnk] ?? 0) + 1;

		byGame[e.gameId] = byGame[e.gameId] || { games: 0, wins: 0 };
		byGame[e.gameId].games++;
		if (isPlayerWinner(e)) byGame[e.gameId].wins++;

		lastSeries.push({
			idx: i + 1,
			cumWins,
			cumGames,
			wr: calculateWinRatePercent(cumWins, cumGames),
		});
	});

	const gameWinRates: GameWinRateRow[] = Object.entries(byGame).map(([gameId, g]) => {
		const game = gameById.get(gameId);
		return {
			gameId,
			name: game?.name ?? "Unknown",
			games: g.games,
			wins: g.wins,
			wr: g.games ? g.wins / g.games : 0,
			points: (game?.points ?? 0) * g.wins,
			color: game?.color ?? "#6366f1",
		};
	});

	const bestGame = gameWinRates
		.filter((g) => g.games >= bestGameMinSamples)
		.sort((a, b) => b.wr - a.wr || b.games - a.games)[0];

	const mostPlayed = gameWinRates.slice().sort((a, b) => b.games - a.games || b.wr - a.wr)[0];

	const mostPoints = gameWinRates.slice().sort((a, b) => b.points - a.points || b.wr - a.wr)[0];

	const rankCounts = Object.entries(ranks)
		.sort((a, b) => Number(a[0]) - Number(b[0]))
		.map(([rank, count]) => ({ rank: Number(rank), count }));

	const lastGamesSeries = lastSeries.slice(-recentWindow).map((p, i) => ({ x: i + 1, wr: p.wr }));

	return { bestGame, mostPlayed, mostPoints, rankCounts, gameWinRates, lastGamesSeries };
}

function checkHeadToHeadWin(me: IPlayerResult, opponent: IPlayerResult): boolean {
	if (me.isWinner && !opponent.isWinner) return true;
	if (!me.isLoser && opponent.isLoser) return true;
	if (me.rank !== null && opponent.rank !== null && me.rank < opponent.rank) return true;
	return false;
}

function checkHeadToHeadLoss(me: IPlayerResult, opponent: IPlayerResult): boolean {
	if (!me.isWinner && opponent.isWinner) return true;
	if (me.isLoser && !opponent.isLoser) return true;
	if (me.rank !== null && opponent.rank !== null && me.rank > opponent.rank) return true;
	return false;
}

export function computeOpponentStats(
	results: IResult[],
	playerById: Map<string, IPlayer>,
	playerId: string,
): TopOpponent[] {
	const tally: Record<string, { games: number; wins: number; losses: number }> = {};

	for (const r of results) {
		const me = r.playerResults.find((pr) => pr.playerId === playerId);
		if (!me) continue;

		for (const pr of r.playerResults) {
			if (pr.playerId === playerId) continue;
			const id = pr.playerId;
			tally[id] = tally[id] || { games: 0, wins: 0, losses: 0 };
			tally[id].games++;
			if (checkHeadToHeadWin(me, pr)) tally[id].wins++;
			if (checkHeadToHeadLoss(me, pr)) tally[id].losses++;
		}
	}

	const rows = Object.entries(tally).map(([oppId, t]) => ({
		opponentId: oppId,
		name: getDisplayName(playerById.get(oppId)),
		games: t.games,
		wins: t.wins,
		losses: t.losses,
	}));

	rows.sort((a, b) => b.games - a.games || b.wins - a.wins);
	return rows.slice(0, 5);
}

export function computeStreaks(entries: PlayerEntry[]): PlayerStreaks {
	let currentWin = 0,
		currentLoss = 0,
		win = 0,
		loss = 0;
	for (const e of entries) {
		const won = isPlayerWinner(e);
		if (won) {
			currentWin += 1;
			currentLoss = 0;
			win = Math.max(win, currentWin);
		} else {
			currentWin = 0;
			currentLoss += 1;
			loss = Math.max(loss, currentLoss);
		}
	}
	return { longestWinStreak: win, longestLossStreak: loss };
}

export function computePlayerData(
	players: IPlayer[],
	results: IResult[],
	gameById: Map<string, IGame>,
	gameType?: GameType,
): PlayerWithData[] {
	const statsMap: Record<
		string,
		{
			wins: number;
			games: number;
			points: number;
		}
	> = {};

	results.forEach((result) => {
		const game = gameById.get(result.gameId);

		// Filter by game type if specified
		if (gameType && game && game.type !== gameType) {
			return;
		}

		result.playerResults.forEach((pr) => {
			if (!statsMap[pr.playerId]) {
				statsMap[pr.playerId] = { wins: 0, games: 0, points: 0 };
			}

			statsMap[pr.playerId].games += 1;

			if (isPlayerWinner(pr)) {
				statsMap[pr.playerId].wins += 1;
				if (game) {
					statsMap[pr.playerId].points += game.points;
				}
			}

			if (pr.isLoser && game) {
				statsMap[pr.playerId].points -= game.points;
			}
		});
	});

	return players.map((player) => {
		const stats = statsMap[player.id] || { wins: 0, games: 0, points: 0 };
		const winRate = calculateWinRate(stats.wins, stats.games);
		const winRatePercent = calculateWinRatePercent(stats.wins, stats.games);

		return {
			...player,
			data: {
				playerId: player.id,
				name: getDisplayName(player),
				fullName: getFullName(player),
				color: getColorForPlayer(player),
				points: stats.points,
				wins: stats.wins,
				games: stats.games,
				winRate,
				winRatePercent,
			},
		};
	});
}
