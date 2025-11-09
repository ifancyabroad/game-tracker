import { useMemo } from "react";
import { computePlayerStats, sortResults, type PlayerStats } from "./stats";
import type { IResult } from "features/events/types";
import { usePlayers } from "features/players/context/PlayersContext";
import { useResults } from "features/events/context/ResultsContext";
import { useGames } from "features/games/context/GamesContext";
import { useEvents } from "features/events/context/EventsContext";

export function usePlayerStatsMap(): Map<string, PlayerStats> {
	const { players } = usePlayers();
	const { results } = useResults();
	const { games } = useGames();
	return useMemo(() => computePlayerStats(players, results, games), [players, results, games]);
}

export function useSortedResults(): IResult[] {
	const { results } = useResults();
	const { eventById } = useEvents();
	return useMemo(() => sortResults(results, eventById), [results, eventById]);
}
