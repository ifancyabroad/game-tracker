import { useMemo } from "react";
import {
	getFeaturedStats,
	getLeaderboard,
	getLeaderboardChampion,
	getDefaultLeaderboard,
	getLeaderboardById,
	leaderboardToFilters,
	getLeaderboardStatus,
	sortLeaderboards,
} from "./calculations";
import { usePlayerData } from "features/players/utils/hooks";
import type { LeaderboardFilters } from "features/players/utils/calculations";
import type { ILeaderboard } from "features/settings/types";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { useEvents } from "features/events/context/EventsContext";
import { useResults } from "features/events/context/ResultsContext";
import { useSettings } from "common/context/SettingsContext";

export function usePlayerLeaderboard(filters: LeaderboardFilters = {}) {
	const playerData = usePlayerData(filters);
	return useMemo(() => getLeaderboard(playerData), [playerData]);
}

export function usePlayerFeaturedStats(filters: LeaderboardFilters = {}) {
	const leaderboard = usePlayerLeaderboard(filters);
	return useMemo(() => getFeaturedStats(leaderboard), [leaderboard]);
}

export function useLeaderboardChampion(filters: LeaderboardFilters = {}) {
	const { events } = useEvents();
	const { results } = useResults();
	const { players } = usePlayers();
	const { gameById } = useGames();

	return useMemo(
		() => getLeaderboardChampion(events, results, players, gameById, filters),
		[events, results, players, gameById, filters],
	);
}

/**
 * Hook to get default leaderboard filters from settings
 * Returns filters object based on the default leaderboard configuration
 */
export function useDefaultLeaderboardFilters(): LeaderboardFilters {
	const { settings } = useSettings();

	return useMemo(() => {
		const leaderboards = settings?.leaderboards || [];
		const defaultLeaderboard = getDefaultLeaderboard(leaderboards);
		return leaderboardToFilters(defaultLeaderboard);
	}, [settings]);
}

/**
 * Hook to get the default leaderboard
 */
export function useDefaultLeaderboard(): ILeaderboard | null {
	const { settings } = useSettings();

	return useMemo(() => {
		const leaderboards = settings?.leaderboards || [];
		return getDefaultLeaderboard(leaderboards);
	}, [settings]);
}

/**
 * Hook to get a specific leaderboard by ID
 */
export function useLeaderboardById(leaderboardId: string | null): ILeaderboard | null {
	const { settings } = useSettings();

	return useMemo(() => {
		const leaderboards = settings?.leaderboards || [];
		return getLeaderboardById(leaderboards, leaderboardId);
	}, [settings, leaderboardId]);
}

/**
 * Hook to get filters for a specific leaderboard
 */
export function useLeaderboardFilters(leaderboardId: string | null): LeaderboardFilters {
	const leaderboard = useLeaderboardById(leaderboardId);
	return useMemo(() => leaderboardToFilters(leaderboard), [leaderboard]);
}

/**
 * Hook to get championship map for displaying champion badges
 * Returns a Map of playerId -> [1] for the champion
 * Only returns champions for completed leaderboards
 */
export function useChampionshipMap(
	filters: LeaderboardFilters = {},
	leaderboard: ILeaderboard | null,
): Map<string, number[]> {
	const champion = useLeaderboardChampion(filters);

	return useMemo(() => {
		const map = new Map<string, number[]>();
		// Only show championship badge for completed leaderboards
		if (champion && leaderboard && leaderboard.endDate) {
			const endDate = new Date(leaderboard.endDate);
			const now = new Date();
			if (now > endDate) {
				map.set(champion.playerId, [1]);
			}
		}
		return map;
	}, [champion, leaderboard]);
}

/**
 * Hook to get the status of a leaderboard
 */
export function useLeaderboardStatus(leaderboard: ILeaderboard | null) {
	return useMemo(() => getLeaderboardStatus(leaderboard), [leaderboard]);
}

/**
 * Hook to get sorted leaderboards
 * Sorted by status (scheduled -> active -> complete), then dates, then alphabetically
 */
export function useSortedLeaderboards(leaderboards: ILeaderboard[]) {
	return useMemo(() => sortLeaderboards(leaderboards), [leaderboards]);
}
