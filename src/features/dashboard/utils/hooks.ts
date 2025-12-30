import { useMemo } from "react";
import { useSortedEvents, useSortedResults } from "features/events/utils/hooks";
import { useResults } from "features/events/context/ResultsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { isPlayerWinner } from "common/utils/gameHelpers";
import { getDisplayName } from "features/players/utils/helpers";
import type { IPlayer } from "features/players/types";

interface IPointScorer {
	player: IPlayer;
	points: number;
}

interface ILongestDrought {
	player: IPlayer;
	gamesSinceWin: number;
}

/**
 * Get the highest point scorer(s) from the most recent event
 */
export function useLastEventTopScorers(): IPointScorer[] {
	const sortedEvents = useSortedEvents();
	const { results } = useResults();
	const { playerById } = usePlayers();
	const { gameById } = useGames();

	return useMemo(() => {
		if (sortedEvents.length === 0) return [];

		const lastEvent = sortedEvents[0];
		const eventResults = results.filter((r) => r.eventId === lastEvent.id);

		// Calculate points per player
		const playerPoints = new Map<string, number>();

		eventResults.forEach((result) => {
			const game = gameById.get(result.gameId);
			if (!game) return;

			result.playerResults.forEach((pr) => {
				if (isPlayerWinner(pr)) {
					const currentPoints = playerPoints.get(pr.playerId) || 0;
					playerPoints.set(pr.playerId, currentPoints + game.points);
				}
			});
		});

		if (playerPoints.size === 0) return [];

		// Find max points
		const maxPoints = Math.max(...Array.from(playerPoints.values()));

		// Get all players with max points
		const topScorers: IPointScorer[] = [];
		playerPoints.forEach((points, playerId) => {
			if (points === maxPoints) {
				const player = playerById.get(playerId);
				if (player) {
					topScorers.push({ player, points });
				}
			}
		});

		return topScorers.sort((a, b) => getDisplayName(a.player).localeCompare(getDisplayName(b.player)));
	}, [sortedEvents, results, playerById, gameById]);
}

/**
 * Get the player with the longest ongoing loss streak (most games since last win)
 */
export function useLongestDrought(): ILongestDrought | null {
	const sortedResults = useSortedResults();
	const { playerById } = usePlayers();

	return useMemo(() => {
		if (sortedResults.length === 0) return null;

		// Track games for each player from most recent backwards
		const playerStreaks = new Map<string, number>();

		// Process from newest to oldest
		for (const result of sortedResults) {
			result.playerResults.forEach((pr) => {
				// Skip if we've already found a win for this player
				if (playerStreaks.has(pr.playerId)) {
					const currentStreak = playerStreaks.get(pr.playerId)!;
					// If they haven't won yet in our count, increment
					if (currentStreak >= 0) {
						playerStreaks.set(pr.playerId, currentStreak + 1);
					}
				} else {
					// First time seeing this player (most recent game)
					if (isPlayerWinner(pr)) {
						// They won their most recent game - mark as -1 (no drought)
						playerStreaks.set(pr.playerId, -1);
					} else {
						// They lost their most recent game - start counting
						playerStreaks.set(pr.playerId, 1);
					}
				}

				// If they won, stop counting for this player
				if (playerStreaks.get(pr.playerId)! > 0 && isPlayerWinner(pr)) {
					playerStreaks.set(pr.playerId, -1);
				}
			});
		}

		// Find player with longest active drought (positive number)
		let longestDrought: ILongestDrought | null = null;
		let maxGamesWithoutWin = 0;

		playerStreaks.forEach((streak, playerId) => {
			if (streak > maxGamesWithoutWin) {
				const player = playerById.get(playerId);
				if (player) {
					maxGamesWithoutWin = streak;
					longestDrought = {
						player,
						gamesSinceWin: streak,
					};
				}
			}
		});

		return longestDrought;
	}, [sortedResults, playerById]);
}
