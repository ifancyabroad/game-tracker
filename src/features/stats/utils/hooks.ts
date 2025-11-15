import { useMemo } from "react";
import { computeMostPlayedGames, computePlayerStats, computePlayerWinsOverTime } from "./stats";
import { useResults } from "features/events/context/ResultsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { useEvents } from "features/events/context/EventsContext";

export function useOverallPageStats() {
	const { results } = useResults();
	const { players } = usePlayers();
	return useMemo(() => computePlayerStats(results, players), [results, players]);
}

export function useMostPlayedGames() {
	const { results } = useResults();
	const { games } = useGames();
	return useMemo(() => computeMostPlayedGames(results, games), [results, games]);
}

export function usePlayerWinsOverTime() {
	const { results } = useResults();
	const { players } = usePlayers();
	const { events } = useEvents();
	return useMemo(() => computePlayerWinsOverTime(results, players, events), [results, players, events]);
}
