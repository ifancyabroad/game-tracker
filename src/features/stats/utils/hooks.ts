import { useMemo } from "react";
import { computeMostPlayedGames, computePlayerWinsOverTime, getFeaturedStats } from "./stats";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { useFilteredData } from "common/utils/hooks";

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
