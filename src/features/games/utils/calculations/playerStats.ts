import type { IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { PlayerGameStats } from "features/games/types";
import { getDisplayName, getColorForPlayer } from "features/players/utils/helpers";
import { isPlayerWinner } from "common/utils/gameHelpers";
import { calculateWinRate, calculateAverage } from "common/utils/calculations";

interface PlayerStatsAccumulator {
	games: number;
	wins: number;
	totalRank: number;
	rankCount: number;
}

/**
 * Create player stats accumulator
 */
function createPlayerStatsAccumulator(): PlayerStatsAccumulator {
	return {
		games: 0,
		wins: 0,
		totalRank: 0,
		rankCount: 0,
	};
}

/**
 * Update player stats with a player result
 */
function updatePlayerStats(stats: PlayerStatsAccumulator, pr: import("features/events/types").IPlayerResult): void {
	stats.games++;

	if (isPlayerWinner(pr)) {
		stats.wins++;
	}

	if (pr.rank !== null && Number.isFinite(pr.rank)) {
		stats.totalRank += pr.rank;
		stats.rankCount++;
	}
}

/**
 * Convert player stats accumulator to final format
 */
function convertToPlayerGameStats(
	playerId: string,
	stats: PlayerStatsAccumulator,
	player: IPlayer | undefined,
	gamePoints: number,
): PlayerGameStats {
	const winRate = calculateWinRate(stats.wins, stats.games);
	const avgRank = calculateAverage(stats.totalRank, stats.rankCount);
	const points = stats.wins * gamePoints;

	return {
		playerId,
		name: getDisplayName(player),
		color: getColorForPlayer(player),
		games: stats.games,
		wins: stats.wins,
		winRate,
		points,
		avgRank,
	};
}

/**
 * Build player stats map from game results
 */
export function buildPlayerStatsMap(
	gameResults: IResult[],
	playerById: Map<string, IPlayer>,
	gamePoints: number,
): PlayerGameStats[] {
	const playerStatsMap = new Map<string, PlayerStatsAccumulator>();

	gameResults.forEach((result) => {
		result.playerResults.forEach((pr) => {
			let stats = playerStatsMap.get(pr.playerId);
			if (!stats) {
				stats = createPlayerStatsAccumulator();
				playerStatsMap.set(pr.playerId, stats);
			}
			updatePlayerStats(stats, pr);
		});
	});

	return Array.from(playerStatsMap.entries()).map(([playerId, stats]) => {
		const player = playerById.get(playerId);
		return convertToPlayerGameStats(playerId, stats, player, gamePoints);
	});
}
