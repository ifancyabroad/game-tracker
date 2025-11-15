import { useMemo } from "react";
import { getFeaturedStats, getLeaderboard } from "./stats";
import { usePlayerStats } from "features/players/utils/hooks";

export function usePlayerLeaderboard() {
	const playerStats = usePlayerStats();
	return useMemo(() => getLeaderboard(playerStats), [playerStats]);
}

export function usePlayerFeaturedStats() {
	const leaderboard = usePlayerLeaderboard();
	return useMemo(() => getFeaturedStats(leaderboard), [leaderboard]);
}
