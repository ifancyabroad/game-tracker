import type { IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IEvent } from "features/events/types";
import type { IGame } from "features/games/types";
import type { GameAggregates, PlayerGameStats } from "features/games/types";
import { STATS_THRESHOLDS } from "common/utils/constants";
import { buildPlayerStatsMap } from "./playerStats";
import { computePlayFrequency, computeRankDistribution } from "./aggregates";

/**
 * Find top and bottom players by win rate (minimum games required)
 */
function findTopAndBottomPlayers(
	playerStats: PlayerGameStats[],
	minGames: number,
): { topPlayer?: PlayerGameStats; bottomPlayer?: PlayerGameStats } {
	const qualified = playerStats
		.filter((p) => p.games >= minGames)
		.sort((a, b) => b.winRate - a.winRate || b.games - a.games);

	return {
		topPlayer: qualified[0],
		bottomPlayer: qualified[qualified.length - 1],
	};
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
	// Get game points
	const gameId = gameResults[0]?.gameId;
	const game = gameId ? gameById.get(gameId) : undefined;
	const gamePoints = game?.points ?? 0;

	// Build player stats
	const playerStats = buildPlayerStatsMap(gameResults, playerById, gamePoints);

	// Find top/bottom players
	const { topPlayer, bottomPlayer } = findTopAndBottomPlayers(playerStats, STATS_THRESHOLDS.MIN_GAMES_FOR_BEST_GAME);

	// Compute time series and distributions
	const playFrequencySeries = computePlayFrequency(gameResults, eventById);
	const rankDistribution = computeRankDistribution(gameResults);

	return {
		topPlayer,
		bottomPlayer,
		playerStats,
		playFrequencySeries,
		rankDistribution,
	};
}
