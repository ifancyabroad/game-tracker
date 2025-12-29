import { useMemo } from "react";
import {
	computeMostPlayedGames,
	computePlayerWinsOverTime,
	getFeaturedStats,
	computeWinStreaks,
	computeLossStreaks,
	computeGameTrendsOverTime,
	computeGameDifficulty,
	computeGamePoints,
	getTopRivalries,
	getLopsidedRivalries,
	getPlayerRivalries,
} from "./calculations";
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

export function useGameTrends() {
	const { results } = useFilteredData();
	const { gameById } = useGames();
	const { eventById } = useEvents();
	return useMemo(() => computeGameTrendsOverTime(results, gameById, eventById), [results, gameById, eventById]);
}

export function useGameDifficulty() {
	const { results } = useFilteredData();
	const { gameById } = useGames();
	return useMemo(() => computeGameDifficulty(results, gameById), [results, gameById]);
}

export function useTopRivalries() {
	const { results } = useFilteredData();
	const { playerById } = usePlayers();
	return useMemo(() => getTopRivalries(results, playerById), [results, playerById]);
}

export function useLopsidedRivalries() {
	const { results } = useFilteredData();
	const { playerById } = usePlayers();
	return useMemo(() => getLopsidedRivalries(results, playerById), [results, playerById]);
}

export function useGamePoints() {
	const { results } = useFilteredData();
	const { gameById } = useGames();
	return useMemo(() => computeGamePoints(results, gameById), [results, gameById]);
}

export function usePlayerRivalries(playerId: string) {
	const { results } = useFilteredData();
	const { playerById } = usePlayers();
	return useMemo(() => getPlayerRivalries(results, playerById, playerId), [results, playerById, playerId]);
}
