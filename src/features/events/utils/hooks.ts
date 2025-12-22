import { useMemo } from "react";
import { sortResults, sortEvents, getSortedEventPlayerStats, getSortedEventGameStats } from "./stats";
import type { IResult, IEvent } from "features/events/types";
import { useEvents } from "features/events/context/EventsContext";
import { useResults } from "features/events/context/ResultsContext";
import { useFilteredData } from "common/utils/hooks";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";

export function useSortedResults(): IResult[] {
	const { results } = useFilteredData();
	const { eventById } = useEvents();
	return useMemo(() => sortResults(results, eventById), [results, eventById]);
}

export function useSortedEvents(): IEvent[] {
	const { events } = useFilteredData();
	return useMemo(() => sortEvents(events), [events]);
}

export function useEventPlayerStats(eventId: string) {
	const { eventById } = useEvents();
	const { results } = useResults();
	const { playerById } = usePlayers();
	const { gameById } = useGames();
	return useMemo(
		() => getSortedEventPlayerStats(eventId, eventById, results, playerById, gameById),
		[eventId, eventById, results, playerById, gameById],
	);
}

export function useEventGameStats(eventId: string) {
	const { eventById } = useEvents();
	const { results } = useResults();
	const { gameById } = useGames();
	const { playerById } = usePlayers();
	return useMemo(
		() => getSortedEventGameStats(eventId, eventById, results, gameById, playerById),
		[eventId, eventById, results, gameById, playerById],
	);
}
