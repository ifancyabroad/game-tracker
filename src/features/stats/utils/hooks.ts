import { useMemo } from "react";
import { computeMostPlayedGames, computePlayerWinsOverTime, getFeaturedStats } from "./stats";
import { useResults } from "features/events/context/ResultsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { useEvents } from "features/events/context/EventsContext";

export function useMostPlayedGames() {
	const { results } = useResults();
	const { gameById } = useGames();
	return useMemo(() => computeMostPlayedGames(results, gameById), [results, gameById]);
}

export function usePlayerWinsOverTime() {
	const { results } = useResults();
	const { playerById } = usePlayers();
	const { events } = useEvents();
	return useMemo(() => computePlayerWinsOverTime(results, playerById, events), [results, playerById, events]);
}

export function useFeaturedStats() {
	const { results } = useResults();
	const { events } = useEvents();
	return useMemo(() => getFeaturedStats(results, events), [results, events]);
}
