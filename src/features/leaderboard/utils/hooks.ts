import { useMemo } from "react";
import { getFeaturedStats, getLeaderboard } from "./stats";
import { usePlayerData } from "features/players/utils/hooks";
import type { GameType } from "features/games/types";

export function usePlayerLeaderboard(gameType?: GameType) {
	const playerData = usePlayerData(gameType);
	return useMemo(() => getLeaderboard(playerData), [playerData]);
}

export function usePlayerFeaturedStats(gameType?: GameType) {
	const leaderboard = usePlayerLeaderboard(gameType);
	return useMemo(() => getFeaturedStats(leaderboard), [leaderboard]);
}
