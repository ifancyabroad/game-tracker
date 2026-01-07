import React, { useState, useMemo, useEffect, type PropsWithChildren } from "react";
import { UIContext } from "./UIContext";
import { useEvents } from "features/events/context/EventsContext";
import { getAvailableYears, getMostRecentYear } from "common/utils/yearFilter";

export const UIProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const { events, loading: eventsLoading } = useEvents();

	const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
	const openSidebar = () => setIsSidebarOpen(true);
	const closeSidebar = () => setIsSidebarOpen(false);

	// Compute available years from events
	const availableYears = useMemo(() => getAvailableYears(events), [events]);

	// Initialize selectedYear to most recent year when events first load
	useEffect(() => {
		if (!eventsLoading && events.length > 0 && selectedYear === null) {
			const mostRecentYear = getMostRecentYear(events);
			setSelectedYear(mostRecentYear);
		}
		// Only run on initial load, not when selectedYear changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventsLoading, events]);

	return (
		<UIContext.Provider
			value={{
				isSidebarOpen,
				toggleSidebar,
				openSidebar,
				closeSidebar,
				selectedYear,
				setSelectedYear,
				availableYears,
			}}
		>
			{children}
		</UIContext.Provider>
	);
};
