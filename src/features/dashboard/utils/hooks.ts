import { useMemo } from "react";
import { useSortedEvents, useSortedResults } from "features/events/utils/hooks";
import { useResults } from "features/events/context/ResultsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { getLastEventTopScorers, getLongestDrought } from "./calculations";
import type { IPointScorer, ILongestDrought } from "./calculations";

/**
 * Get the highest point scorer(s) from the most recent event
 */
export function useLastEventTopScorers(): IPointScorer[] {
	const sortedEvents = useSortedEvents();
	const { results } = useResults();
	const { playerById } = usePlayers();
	const { gameById } = useGames();

	return useMemo(
		() => getLastEventTopScorers(sortedEvents, results, playerById, gameById),
		[sortedEvents, results, playerById, gameById],
	);
}

/**
 * Get the player with the most games played since their last win
 */
export function useLongestDrought(): ILongestDrought | null {
	const sortedResults = useSortedResults();
	const { playerById } = usePlayers();

	return useMemo(() => getLongestDrought(sortedResults, playerById), [sortedResults, playerById]);
}
