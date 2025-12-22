import { useState, useEffect, useMemo, useContext } from "react";
import { useAuth } from "common/context/AuthContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { useEvents } from "features/events/context/EventsContext";
import { useResults } from "features/events/context/ResultsContext";
import { useUI } from "common/context/UIContext";
import { filterEventsByYear, filterResultsByYear } from "common/utils/yearFilter";
import { ToastContext } from "common/context/ToastContext";

export function useAppReady() {
	const a = useAuth();
	const p = usePlayers();
	const g = useGames();
	const e = useEvents();
	const r = useResults();
	return { loading: a.loading || p.loading || g.loading || e.loading || r.loading };
}

export function useIsMobile(breakpoint = 768) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < breakpoint);
		};

		checkIsMobile();
		window.addEventListener("resize", checkIsMobile);

		return () => window.removeEventListener("resize", checkIsMobile);
	}, [breakpoint]);

	return isMobile;
}

/**
 * Hook to get events and results filtered by the currently selected year
 */
export function useFilteredData() {
	const { events } = useEvents();
	const { results } = useResults();
	const { selectedYear } = useUI();

	const filteredEvents = useMemo(() => filterEventsByYear(events, selectedYear), [events, selectedYear]);

	const filteredResults = useMemo(
		() => filterResultsByYear(results, events, selectedYear),
		[results, events, selectedYear],
	);

	return {
		events: filteredEvents,
		results: filteredResults,
	};
}

export function useToast() {
	const context = useContext(ToastContext);
	if (context === undefined) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context.showToast;
}
