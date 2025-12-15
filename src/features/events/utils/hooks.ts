import { useMemo } from "react";
import { sortResults } from "./stats";
import type { IResult } from "features/events/types";
import { useEvents } from "features/events/context/EventsContext";
import { useFilteredData } from "common/utils/hooks";

export function useSortedResults(): IResult[] {
	const { results } = useFilteredData();
	const { eventById } = useEvents();
	return useMemo(() => sortResults(results, eventById), [results, eventById]);
}
