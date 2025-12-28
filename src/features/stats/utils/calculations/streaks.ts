import type { IEvent, IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { StreakPlayer, StreakStats } from "features/stats/types";
import { getColorForPlayer, getDisplayName } from "features/players/utils/helpers";
import { isPlayerWinner } from "common/utils/gameHelpers";
import { sortResultsChronologically } from "common/utils/sorting";
import { DISPLAY_LIMITS } from "common/utils/constants";

/**
 * Initialize streak tracking for all players
 */
function initializePlayerStreaks(results: IResult[]): Record<string, StreakStats> {
	const playerStreaks: Record<string, StreakStats> = {};
	results.forEach((result) => {
		result.playerResults.forEach((pr) => {
			if (!playerStreaks[pr.playerId]) {
				playerStreaks[pr.playerId] = { currentStreak: 0, maxStreak: 0 };
			}
		});
	});
	return playerStreaks;
}

/**
 * Update streak based on win condition
 */
function updateStreak(stats: StreakStats, shouldIncrement: boolean): void {
	if (shouldIncrement) {
		stats.currentStreak++;
		stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
	} else {
		stats.currentStreak = 0;
	}
}

/**
 * Map player streaks to display format
 */
function mapStreaksToPlayers(
	playerStreaks: Record<string, StreakStats>,
	playerById: Map<string, IPlayer>,
): (StreakPlayer | null)[] {
	return Object.entries(playerStreaks).map(([playerId, stats]) => {
		const player = playerById.get(playerId);
		if (!player) return null;

		return {
			playerId,
			playerName: getDisplayName(player),
			playerColor: getColorForPlayer(player),
			streak: stats.maxStreak,
		};
	});
}

/**
 * Filter, sort, and limit streak players
 */
function filterAndSortStreaks(players: (StreakPlayer | null)[], topN: number): StreakPlayer[] {
	return players
		.filter((p): p is StreakPlayer => p !== null && p.streak > 0)
		.sort((a, b) => b.streak - a.streak)
		.slice(0, topN);
}

/**
 * Compute win streaks for players
 */
export function computeWinStreaks(
	results: IResult[],
	playerById: Map<string, IPlayer>,
	eventById: Map<string, IEvent>,
): StreakPlayer[] {
	const sortedResults = sortResultsChronologically(results, eventById);
	const playerStreaks = initializePlayerStreaks(sortedResults);

	sortedResults.forEach((result) => {
		result.playerResults.forEach((pr) => {
			const stats = playerStreaks[pr.playerId];
			const isWin = isPlayerWinner(pr);
			updateStreak(stats, isWin);
		});
	});

	const streakPlayers = mapStreaksToPlayers(playerStreaks, playerById);
	return filterAndSortStreaks(streakPlayers, DISPLAY_LIMITS.TABLES.STREAKS);
}

/**
 * Compute loss streaks for players
 */
export function computeLossStreaks(
	results: IResult[],
	playerById: Map<string, IPlayer>,
	eventById: Map<string, IEvent>,
): StreakPlayer[] {
	const sortedResults = sortResultsChronologically(results, eventById);
	const playerStreaks = initializePlayerStreaks(sortedResults);

	sortedResults.forEach((result) => {
		result.playerResults.forEach((pr) => {
			const stats = playerStreaks[pr.playerId];
			const isWin = isPlayerWinner(pr);
			updateStreak(stats, !isWin);
		});
	});

	const streakPlayers = mapStreaksToPlayers(playerStreaks, playerById);
	return filterAndSortStreaks(streakPlayers, DISPLAY_LIMITS.TABLES.STREAKS);
}
