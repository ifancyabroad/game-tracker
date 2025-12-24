import type { IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IEvent } from "features/events/types";
import type { IGame } from "features/games/types";
import type { GameAggregates, PlayerGameStats } from "features/games/types";
import { STATS_THRESHOLDS } from "common/utils/constants";
import { buildPlayerStatsMap } from "./playerStats";
import { computePlayFrequency, computeRankDistribution } from "./aggregates";

/**
 * Find top player by win rate (highest win rate, tie-break by most games)
 */
function findTopPlayer(playerStats: PlayerGameStats[], minGames: number): PlayerGameStats | undefined {
	const qualified = playerStats.filter((p) => p.games >= minGames);

	if (qualified.length === 0) {
		return undefined;
	}

	return qualified.reduce((best, current) => {
		if (current.winRate > best.winRate) return current;
		if (current.winRate === best.winRate && current.games > best.games) return current;
		return best;
	});
}

/**
 * Find bottom player by win rate (lowest win rate, tie-break by most games)
 */
function findBottomPlayer(playerStats: PlayerGameStats[], minGames: number): PlayerGameStats | undefined {
	const qualified = playerStats.filter((p) => p.games >= minGames);

	if (qualified.length === 0) {
		return undefined;
	}

	return qualified.reduce((worst, current) => {
		if (current.winRate < worst.winRate) return current;
		if (current.winRate === worst.winRate && current.games > worst.games) return current;
		return worst;
	});
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
	const topPlayer = findTopPlayer(playerStats, STATS_THRESHOLDS.MIN_GAMES_FOR_BEST_GAME);
	const bottomPlayer = findBottomPlayer(playerStats, STATS_THRESHOLDS.MIN_GAMES_FOR_BEST_GAME);

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
