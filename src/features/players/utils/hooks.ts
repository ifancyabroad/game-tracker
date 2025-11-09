import { useMemo } from "react";
import { getPlayerEntries, aggregatePlayerStatsForPage, computeOpponentStats, computeStreaks } from "./stats";
import { useResults } from "features/events/context/ResultsContext";
import { useGames } from "features/games/context/GamesContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useSortedResults } from "features/events/utils/hooks";

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
