import { isPlayerWinner } from "common/utils/gameHelpers";
import type { IPlayer } from "features/players/types";
import type { IResult } from "features/events/types";

export interface ILongestDrought {
	player: IPlayer;
	gamesSinceWin: number;
}

/**
 * Calculate the player with the most games played since their last win
 */
export function getLongestDrought(sortedResults: IResult[], playerById: Map<string, IPlayer>): ILongestDrought | null {
	if (sortedResults.length === 0) return null;

	// Track games since last win for each player
	const playerStreaks = new Map<string, { count: number; stopped: boolean }>();

	// Process from newest to oldest
	for (let i = sortedResults.length - 1; i >= 0; i--) {
		const result = sortedResults[i];
		result.playerResults.forEach((pr) => {
			const streak = playerStreaks.get(pr.playerId);

			// If we already found a win for this player, stop counting
			if (streak?.stopped) return;

			if (isPlayerWinner(pr)) {
				// Found a win - stop counting here
				playerStreaks.set(pr.playerId, {
					count: streak?.count ?? 0,
					stopped: true,
				});
			} else {
				// They didn't win - increment count
				playerStreaks.set(pr.playerId, {
					count: (streak?.count ?? 0) + 1,
					stopped: false,
				});
			}
		});
	}

	// Find player with highest count
	let longestDrought: ILongestDrought | null = null;
	let maxGames = 0;

	playerStreaks.forEach((streak, playerId) => {
		if (streak.count > maxGames) {
			const player = playerById.get(playerId);
			if (player) {
				maxGames = streak.count;
				longestDrought = {
					player,
					gamesSinceWin: streak.count,
				};
			}
		}
	});

	return longestDrought;
}
