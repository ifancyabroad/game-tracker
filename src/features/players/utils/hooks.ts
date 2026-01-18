import { useMemo } from "react";
import { useAuth } from "common/context/AuthContext";
import {
	getPlayerEntries,
	aggregatePlayerStatsForPage,
	computeStreaks,
	computePlayerData,
	type LeaderboardFilters,
} from "./calculations";
import type { PlayerWithData } from "features/players/types";
import { useGames } from "features/games/context/GamesContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useSortedResults } from "features/events/utils/hooks";
import { useFilteredData } from "common/utils/hooks";
import { useEvents } from "features/events/context/EventsContext";

/**
 * Hook to get the linked player profile for the current authenticated user
 * Returns null if user is not logged in or has no linked player
 */
export function useCurrentPlayer() {
	const { user } = useAuth();
	const { playerById } = usePlayers();

	return user?.linkedPlayerId ? playerById.get(user.linkedPlayerId) || null : null;
}

export function usePlayerData(filters: LeaderboardFilters = {}): PlayerWithData[] {
	const { players } = usePlayers();
	const { results } = useFilteredData();
	const { events } = useEvents();
	const { gameById } = useGames();
	return useMemo(
		() => computePlayerData(players, results, gameById, events, filters),
		[players, results, gameById, events, filters],
	);
}

export function usePlayerDataById(playerId: string, filters: LeaderboardFilters = {}): PlayerWithData | undefined {
	const allData = usePlayerData(filters);
	return useMemo(() => allData.find((data) => data.id === playerId), [allData, playerId]);
}

export function usePlayerEntries(playerId: string) {
	const results = useSortedResults();
	return useMemo(() => getPlayerEntries(results, playerId), [results, playerId]);
}

export function usePlayerPageStats(playerId: string) {
	const entries = usePlayerEntries(playerId);
	const { gameById } = useGames();
	const { events } = useEvents();
	const { results } = useResults();
	return useMemo(
		() => aggregatePlayerStatsForPage(playerId, entries, gameById, events, results),
		[playerId, entries, gameById, events, results],
	);
}

export function usePlayerStreaks(playerId: string) {
	const entries = usePlayerEntries(playerId);
	return useMemo(() => computeStreaks(entries), [entries]);
}
