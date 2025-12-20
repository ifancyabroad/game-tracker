import { useMemo } from "react";
import {
	computeMostPlayedGames,
	computePlayerWinsOverTime,
	getFeaturedStats,
	computeWinStreaks,
	computeLossStreaks,
} from "./stats";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { useFilteredData } from "common/utils/hooks";
import { useEvents } from "features/events/context/EventsContext";

export function useMostPlayedGames() {
	const { results } = useFilteredData();
	const { gameById } = useGames();
	return useMemo(() => computeMostPlayedGames(results, gameById), [results, gameById]);
}

export function usePlayerWinsOverTime() {
	const { results, events } = useFilteredData();
	const { playerById } = usePlayers();
	return useMemo(() => computePlayerWinsOverTime(results, playerById, events), [results, playerById, events]);
}

export function useFeaturedStats() {
	const { results, events } = useFilteredData();
	return useMemo(() => getFeaturedStats(results, events), [results, events]);
}

export function useWinStreaks() {
	const { results } = useFilteredData();
	const { playerById } = usePlayers();
	const { eventById } = useEvents();
	return useMemo(() => computeWinStreaks(results, playerById, eventById), [results, playerById, eventById]);
}

export function useLossStreaks() {
	const { results } = useFilteredData();
	const { playerById } = usePlayers();
	const { eventById } = useEvents();
	return useMemo(() => computeLossStreaks(results, playerById, eventById), [results, playerById, eventById]);
}
