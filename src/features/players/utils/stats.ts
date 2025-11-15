import type { IPlayerResult, IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";
import { getColorForPlayer, getDisplayName } from "./helpers";

export interface PlayerStats {
	playerId: string;
	name: string;
	color: string;
	pictureUrl: string | null;
	points: number;
	wins: number;
	games: number;
	winRate: number; // Decimal (0-1)
	winRatePercent: number; // Percentage (0-100)
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
		name: gameById.get(gameId)?.name ?? "Unknown",
		games: g.games,
		wins: g.wins,
		wr: g.games ? g.wins / g.games : 0,
		points: (gameById.get(gameId)?.points ?? 0) * g.wins,
	}));

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
		const won = !!e.isWinner || e.rank === 1;
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

export function computePlayerStats(players: IPlayer[], results: IResult[], games: IGame[]): PlayerStats[] {
	const statsMap: Record<
		string,
		{
			wins: number;
			games: number;
			points: number;
		}
	> = {};

	results.forEach((result) => {
		const game = games.find((g) => g.id === result.gameId);

		result.playerResults.forEach((pr) => {
			if (!statsMap[pr.playerId]) {
				statsMap[pr.playerId] = { wins: 0, games: 0, points: 0 };
			}

			statsMap[pr.playerId].games += 1;

			if (pr.isWinner || pr.rank === 1) {
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
		const winRate = stats.games > 0 ? stats.wins / stats.games : 0;
		const winRatePercent = Math.round(winRate * 100);

		return {
			playerId: player.id,
			name: getDisplayName(player),
			color: getColorForPlayer(player),
			pictureUrl: player.pictureUrl || null,
			points: stats.points,
			wins: stats.wins,
			games: stats.games,
			winRate,
			winRatePercent,
		};
	});
}
