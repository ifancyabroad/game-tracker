import { usePlayers } from "features/players/context/PlayersContext";
import { useMemo } from "react";
import { getFeaturedStats, getLeaderboard } from "./stats";
import { usePlayerStatsMap } from "features/events/utils/hooks";

export function usePlayerLeaderboard() {
	const { players } = usePlayers();
	const statsMap = usePlayerStatsMap();
	return useMemo(() => getLeaderboard(players, statsMap), [players, statsMap]);
}

export function usePlayerFeaturedStats() {
	const leaderboard = usePlayerLeaderboard();
	return useMemo(() => getFeaturedStats(leaderboard), [leaderboard]);
}
