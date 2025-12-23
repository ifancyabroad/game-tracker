import type { IResult } from "features/events/types";
import type { IPlayer, PlayerData, PlayerWithData } from "features/players/types";
import type { GameType, IGame } from "features/games/types";
import { getColorForPlayer, getDisplayName, getFullName } from "../helpers";
import { isPlayerWinner } from "common/utils/gameHelpers";
import { calculateWinRate, calculateWinRatePercent } from "common/utils/calculations";

interface PlayerStatsAccumulator {
	wins: number;
	games: number;
	points: number;
}

/**
 * Create stats accumulator
 */
function createStatsAccumulator(): PlayerStatsAccumulator {
	return { wins: 0, games: 0, points: 0 };
}

/**
 * Check if game matches type filter
 */
function shouldIncludeGame(game: IGame | undefined, gameType: GameType | undefined): boolean {
	if (!gameType) return true;
	if (!game) return false;
	return game.type === gameType;
}

/**
 * Update stats with player result
 */
function updateStatsWithResult(
	stats: PlayerStatsAccumulator,
	pr: import("features/events/types").IPlayerResult,
	game: IGame | undefined,
): void {
	stats.games += 1;

	if (isPlayerWinner(pr)) {
		stats.wins += 1;
		if (game) {
			stats.points += game.points;
		}
	}

	if (pr.isLoser && game) {
		stats.points -= game.points;
	}
}

/**
 * Convert stats to player data
 */
function convertToPlayerData(player: IPlayer, stats: PlayerStatsAccumulator): PlayerData {
	const winRate = calculateWinRate(stats.wins, stats.games);
	const winRatePercent = calculateWinRatePercent(stats.wins, stats.games);

	return {
		playerId: player.id,
		name: getDisplayName(player),
		fullName: getFullName(player),
		color: getColorForPlayer(player),
		points: stats.points,
		wins: stats.wins,
		games: stats.games,
		winRate,
		winRatePercent,
	};
}

/**
 * Compute player data for all players
 */
export function computePlayerData(
	players: IPlayer[],
	results: IResult[],
	gameById: Map<string, IGame>,
	gameType?: GameType,
): PlayerWithData[] {
	const statsMap = new Map<string, PlayerStatsAccumulator>();

	results.forEach((result) => {
		const game = gameById.get(result.gameId);

		// Filter by game type if specified
		if (!shouldIncludeGame(game, gameType)) {
			return;
		}

		result.playerResults.forEach((pr) => {
			let stats = statsMap.get(pr.playerId);
			if (!stats) {
				stats = createStatsAccumulator();
				statsMap.set(pr.playerId, stats);
			}

			updateStatsWithResult(stats, pr, game);
		});
	});

	return players.map((player) => {
		const stats = statsMap.get(player.id) || createStatsAccumulator();
		return {
			...player,
			data: convertToPlayerData(player, stats),
		};
	});
}
