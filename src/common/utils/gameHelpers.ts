import type { IPlayerResult } from "features/events/types";

/**
 * Checks if a player won based on their result.
 * A player is considered a winner if they have isWinner flag or rank 1.
 */
export const isPlayerWinner = (playerResult: Pick<IPlayerResult, "isWinner" | "rank">): boolean => {
	return !!playerResult.isWinner || playerResult.rank === 1;
};
