import { useMemo } from "react";
import { sortResults } from "./stats";
import type { IResult } from "features/events/types";
import { useResults } from "features/events/context/ResultsContext";
import { useEvents } from "features/events/context/EventsContext";

export function useSortedResults(): IResult[] {
	const { results } = useResults();
	const { eventById } = useEvents();
	return useMemo(() => sortResults(results, eventById), [results, eventById]);
}
