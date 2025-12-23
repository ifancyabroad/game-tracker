import type { IResult } from "features/events/types";
import type { IGame, GameData, GameWithData } from "features/games/types";
import { isPlayerWinner } from "common/utils/gameHelpers";

interface GameStatsAccumulator {
	timesPlayed: number;
	totalPointsAwarded: number;
	playerSet: Set<string>;
	totalPlayerCount: number;
}

/**
 * Initialize stats accumulator for a game
 */
function createStatsAccumulator(): GameStatsAccumulator {
	return {
		timesPlayed: 0,
		totalPointsAwarded: 0,
		playerSet: new Set(),
		totalPlayerCount: 0,
	};
}

/**
 * Update stats accumulator with result data
 */
function updateStatsWithResult(stats: GameStatsAccumulator, result: IResult, gamePoints: number): void {
	stats.timesPlayed++;
	stats.totalPlayerCount += result.playerResults.length;

	result.playerResults.forEach((pr) => {
		stats.playerSet.add(pr.playerId);
		if (isPlayerWinner(pr)) {
			stats.totalPointsAwarded += gamePoints;
		}
	});
}

/**
 * Convert stats accumulator to GameData
 */
function convertToGameData(game: IGame, stats: GameStatsAccumulator): GameData {
	const avgPlayersPerGame = stats.timesPlayed > 0 ? stats.totalPlayerCount / stats.timesPlayed : 0;

	return {
		gameId: game.id,
		name: game.name,
		points: game.points,
		timesPlayed: stats.timesPlayed,
		totalPointsAwarded: stats.totalPointsAwarded,
		uniquePlayers: stats.playerSet.size,
		avgPlayersPerGame: Math.round(avgPlayersPerGame * 10) / 10,
	};
}

/**
 * Compute basic game data for all games
 */
export function computeGameData(games: IGame[], results: IResult[]): GameWithData[] {
	const gameStatsMap = new Map<string, GameStatsAccumulator>();

	// Initialize all games
	games.forEach((game) => {
		gameStatsMap.set(game.id, createStatsAccumulator());
	});

	// Aggregate stats from results
	results.forEach((result) => {
		let stats = gameStatsMap.get(result.gameId);
		if (!stats) {
			stats = createStatsAccumulator();
			gameStatsMap.set(result.gameId, stats);
		}

		const game = games.find((g) => g.id === result.gameId);
		const gamePoints = game?.points ?? 0;
		updateStatsWithResult(stats, result, gamePoints);
	});

	// Convert to final format
	return games.map((game) => {
		const stats = gameStatsMap.get(game.id) || createStatsAccumulator();
		return {
			...game,
			data: convertToGameData(game, stats),
		};
	});
}

/**
 * Get all results for a specific game
 */
export function getGameResults(results: IResult[], gameId: string): IResult[] {
	return results.filter((r) => r.gameId === gameId);
}
