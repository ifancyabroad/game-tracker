import type { PlayerEntry, PlayerStreaks } from "features/players/types";
import { isPlayerWinner } from "common/utils/gameHelpers";

/**
 * Compute win and loss streaks for a player
 */
export function computeStreaks(entries: PlayerEntry[]): PlayerStreaks {
	let currentWin = 0;
	let currentLoss = 0;
	let longestWinStreak = 0;
	let longestLossStreak = 0;

	for (const entry of entries) {
		const won = isPlayerWinner(entry);

		if (won) {
			currentWin += 1;
			currentLoss = 0;
			longestWinStreak = Math.max(longestWinStreak, currentWin);
		} else {
			currentWin = 0;
			currentLoss += 1;
			longestLossStreak = Math.max(longestLossStreak, currentLoss);
		}
	}

	return { longestWinStreak, longestLossStreak };
}
