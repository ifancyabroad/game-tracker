import { useMemo } from "react";
import { computeMostPlayedGames, computePlayerWinsOverTime, getFeaturedStats } from "./stats";
import { useResults } from "features/events/context/ResultsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { useEvents } from "features/events/context/EventsContext";

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

export function useFeaturedStats() {
	const { results } = useResults();
	const { events } = useEvents();
	return useMemo(() => getFeaturedStats(results, events), [results, events]);
}
