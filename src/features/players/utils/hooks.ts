import { useMemo } from "react";
import {
	getPlayerEntries,
	aggregatePlayerStatsForPage,
	computeOpponentStats,
	computeStreaks,
	type PlayerStats,
	computePlayerStats,
} from "./stats";
import { useResults } from "features/events/context/ResultsContext";
import { useGames } from "features/games/context/GamesContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useSortedResults } from "features/events/utils/hooks";

export function usePlayerStats(): PlayerStats[] {
	const { players } = usePlayers();
	const { results } = useResults();
	const { games } = useGames();
	return useMemo(() => computePlayerStats(players, results, games), [players, results, games]);
}

export function usePlayerStatsById(playerId: string): PlayerStats | undefined {
	const allStats = usePlayerStats();
	return useMemo(() => allStats.find((stat) => stat.playerId === playerId), [allStats, playerId]);
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
	const { results } = useResults();
	const { playerById } = usePlayers();
	return useMemo(() => computeOpponentStats(results, playerById, playerId), [results, playerById, playerId]);
}
