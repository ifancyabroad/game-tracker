import { useMemo } from "react";
import {
	getPlayerEntries,
	aggregatePlayerStatsForPage,
	computeOpponentStats,
	computeStreaks,
	computePlayerData,
} from "./calculations";
import type { PlayerWithData } from "features/players/types";
import { useGames } from "features/games/context/GamesContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useSortedResults } from "features/events/utils/hooks";
import { useFilteredData } from "common/utils/hooks";
import { useEvents } from "features/events/context/EventsContext";
import type { GameType } from "features/games/types";

export function usePlayerData(gameType?: GameType): PlayerWithData[] {
	const { players } = usePlayers();
	const { results } = useFilteredData();
	const { events } = useEvents();
	const { gameById } = useGames();
	return useMemo(
		() => computePlayerData(players, results, gameById, events, gameType),
		[players, results, gameById, events, gameType],
	);
}

export function usePlayerDataById(playerId: string): PlayerWithData | undefined {
	const allData = usePlayerData();
	return useMemo(() => allData.find((data) => data.id === playerId), [allData, playerId]);
}

export function usePlayerEntries(playerId: string) {
	const results = useSortedResults();
	return useMemo(() => getPlayerEntries(results, playerId), [results, playerId]);
}

export function usePlayerPageStats(playerId: string) {
	const entries = usePlayerEntries(playerId);
	const { gameById } = useGames();
	return useMemo(() => aggregatePlayerStatsForPage(entries, gameById), [entries, gameById]);
}

export function usePlayerStreaks(playerId: string) {
	const entries = usePlayerEntries(playerId);
	return useMemo(() => computeStreaks(entries), [entries]);
}

export function useTopOpponents(playerId: string) {
	const { results } = useFilteredData();
	const { playerById } = usePlayers();
	return useMemo(() => computeOpponentStats(results, playerById, playerId), [results, playerById, playerId]);
}
