import { useMemo } from "react";
import { getFeaturedStats, getLeaderboard } from "./stats";
import { usePlayerData } from "features/players/utils/hooks";

export function usePlayerLeaderboard() {
	const playerData = usePlayerData();
	return useMemo(() => getLeaderboard(playerData), [playerData]);
}

export function usePlayerFeaturedStats() {
	const leaderboard = usePlayerLeaderboard();
	return useMemo(() => getFeaturedStats(leaderboard), [leaderboard]);
}
