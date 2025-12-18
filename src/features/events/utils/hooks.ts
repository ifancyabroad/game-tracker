import { useMemo } from "react";
import {
	sortResults,
	sortEvents,
	getEventPlayerStats,
	getEventGameStats,
	sortEventPlayerStats,
	sortEventGameStats,
} from "./stats";
import type { IResult, IEvent } from "features/events/types";
import { useEvents } from "features/events/context/EventsContext";
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

export function useEventPlayerStats(event: IEvent | undefined, eventResults: IResult[]) {
	const { playerById } = usePlayers();
	return useMemo(() => {
		if (!event) return [];
		const stats = getEventPlayerStats(event, eventResults, playerById);
		return sortEventPlayerStats(stats);
	}, [event, eventResults, playerById]);
}

export function useEventGameStats(event: IEvent | undefined, eventResults: IResult[]) {
	const { gameById } = useGames();
	const { playerById } = usePlayers();
	return useMemo(() => {
		if (!event) return [];
		const stats = getEventGameStats(event, eventResults, gameById, playerById);
		return sortEventGameStats(stats);
	}, [event, eventResults, gameById, playerById]);
}
