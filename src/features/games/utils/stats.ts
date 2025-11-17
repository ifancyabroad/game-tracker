import type { IResult } from "features/events/types";
import type { IGame } from "features/games/types";
import type { IPlayer } from "features/players/types";
import type { IEvent } from "features/events/types";
import { getDisplayName, getColorForPlayer } from "features/players/utils/helpers";
import { isPlayerWinner } from "common/utils/gameHelpers";
import { format, parseISO } from "date-fns";

export interface GameData {
	gameId: string;
	name: string;
	points: number;
	timesPlayed: number;
	totalWinners: number;
	uniquePlayers: number;
	avgPlayersPerGame: number;
}

export interface GameWithData extends IGame {
	data: GameData;
}

export interface PlayerGameStats {
	playerId: string;
	name: string;
	color: string;
	games: number;
	wins: number;
	winRate: number;
	points: number;
	avgRank: number;
}

export interface GameAggregates {
	topPlayer?: PlayerGameStats;
	bottomPlayer?: PlayerGameStats;
	playerStats: PlayerGameStats[];
	playFrequencySeries: Array<{ date: string; plays: number }>;
	rankDistribution: Array<{ rank: number; count: number }>;
}

/**
 * Get all results for a specific game
 */
export function getGameResults(results: IResult[], gameId: string): IResult[] {
	return results.filter((r) => r.gameId === gameId);
}

/**
 * Compute aggregate stats for a game page
 */
export function aggregateGameStatsForPage(
	gameResults: IResult[],
	playerById: Map<string, IPlayer>,
	eventById: Map<string, IEvent>,
	gameById: Map<string, IGame>,
): GameAggregates {
	// Track player stats
	const playerStatsMap: Record<
		string,
		{
			games: number;
			wins: number;
			totalRank: number;
			rankCount: number;
		}
	> = {};

	// Track rank distribution
	const rankCounts: Record<number, number> = {};

	// Track play frequency by date
	const datePlayCounts: Record<string, number> = {};

	gameResults.forEach((result) => {
		// Get event date for frequency chart
		const event = eventById.get(result.eventId);
		if (event) {
			const dateKey = format(parseISO(event.date), "MMM d");
			datePlayCounts[dateKey] = (datePlayCounts[dateKey] || 0) + 1;
		}

		result.playerResults.forEach((pr) => {
			// Initialize player stats
			if (!playerStatsMap[pr.playerId]) {
				playerStatsMap[pr.playerId] = {
					games: 0,
					wins: 0,
					totalRank: 0,
					rankCount: 0,
				};
			}

			const stats = playerStatsMap[pr.playerId];
			stats.games++;

			if (isPlayerWinner(pr)) {
				stats.wins++;
			}

			// Track rank
			if (pr.rank !== null && Number.isFinite(pr.rank)) {
				stats.totalRank += pr.rank;
				stats.rankCount++;
				rankCounts[pr.rank] = (rankCounts[pr.rank] || 0) + 1;
			}
		});
	});

	// Calculate game points
	const gameId = gameResults[0]?.gameId;
	const game = gameId ? gameById.get(gameId) : undefined;
	const gamePoints = game?.points ?? 0;

	// Convert player stats to array
	const playerStats: PlayerGameStats[] = Object.entries(playerStatsMap).map(([playerId, stats]) => {
		const winRate = stats.games > 0 ? stats.wins / stats.games : 0;
		const avgRank = stats.rankCount > 0 ? stats.totalRank / stats.rankCount : 0;
		const points = stats.wins * gamePoints;

		return {
			playerId,
			name: getDisplayName(playerById.get(playerId)),
			color: getColorForPlayer(playerById.get(playerId)),
			games: stats.games,
			wins: stats.wins,
			winRate,
			points,
			avgRank,
		};
	});

	const sortedByWinRate = playerStats
		.filter((p) => p.games >= 3)
		.sort((a, b) => b.winRate - a.winRate || b.games - a.games);

	// Find top player by win rate (min 3 games)
	const topPlayer = sortedByWinRate[0];

	// Find bottom player by win rate (min 3 games)
	const bottomPlayer = sortedByWinRate[sortedByWinRate.length - 1];

	// Convert play frequency to series
	const playFrequencySeries = Object.entries(datePlayCounts)
		.map(([date, plays]) => ({ date, plays }))
		.slice(-20); // Last 20 dates

	// Convert rank distribution to array
	const rankDistribution = Object.entries(rankCounts)
		.map(([rank, count]) => ({ rank: Number(rank), count }))
		.sort((a, b) => a.rank - b.rank);

	return {
		topPlayer,
		bottomPlayer,
		playerStats,
		playFrequencySeries,
		rankDistribution,
	};
}

/**
 * Compute basic game data for all games
 */
export function computeGameData(games: IGame[], results: IResult[]): GameWithData[] {
	const gameStatsMap: Record<
		string,
		{
			timesPlayed: number;
			totalWinners: number;
			playerSet: Set<string>;
			totalPlayerCount: number;
		}
	> = {};

	// Initialize all games
	games.forEach((game) => {
		gameStatsMap[game.id] = {
			timesPlayed: 0,
			totalWinners: 0,
			playerSet: new Set(),
			totalPlayerCount: 0,
		};
	});

	// Aggregate stats from results
	results.forEach((result) => {
		if (!gameStatsMap[result.gameId]) {
			gameStatsMap[result.gameId] = {
				timesPlayed: 0,
				totalWinners: 0,
				playerSet: new Set(),
				totalPlayerCount: 0,
			};
		}

		const stats = gameStatsMap[result.gameId];
		stats.timesPlayed++;
		stats.totalPlayerCount += result.playerResults.length;

		result.playerResults.forEach((pr) => {
			stats.playerSet.add(pr.playerId);
			if (isPlayerWinner(pr)) {
				stats.totalWinners++;
			}
		});
	});

	return games.map((game) => {
		const stats = gameStatsMap[game.id] || {
			timesPlayed: 0,
			totalWinners: 0,
			playerSet: new Set(),
			totalPlayerCount: 0,
		};

		const avgPlayersPerGame = stats.timesPlayed > 0 ? stats.totalPlayerCount / stats.timesPlayed : 0;

		return {
			...game,
			data: {
				gameId: game.id,
				name: game.name,
				points: game.points,
				timesPlayed: stats.timesPlayed,
				totalWinners: stats.totalWinners,
				uniquePlayers: stats.playerSet.size,
				avgPlayersPerGame: Math.round(avgPlayersPerGame * 10) / 10,
			},
		};
	});
}
