import { useMemo } from "react";
import {
	getPlayerEntries,
	aggregatePlayerStatsForPage,
	computeOpponentStats,
	computeStreaks,
	type PlayerWithData,
	computePlayerData,
} from "./stats";
import { useGames } from "features/games/context/GamesContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useSortedResults } from "features/events/utils/hooks";
import { useFilteredData } from "common/utils/hooks";
import type { GameType } from "features/games/types";

export function usePlayerData(gameType?: GameType): PlayerWithData[] {
	const { players } = usePlayers();
	const { results } = useFilteredData();
	const { gameById } = useGames();
	return useMemo(
		() => computePlayerData(players, results, gameById, gameType),
		[players, results, gameById, gameType],
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
