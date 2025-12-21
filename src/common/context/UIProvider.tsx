import React, { useState, useMemo, useEffect, type PropsWithChildren } from "react";
import { UIContext } from "./UIContext";
import { useEvents } from "features/events/context/EventsContext";
import { getAvailableYears, getMostRecentYear } from "common/utils/yearFilter";
import { getInitialTheme, type Theme } from "common/utils/theme";

export const UIProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const [theme, setTheme] = useState<Theme>(getInitialTheme);
	const { events, loading: eventsLoading } = useEvents();

	const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
	const openSidebar = () => setIsSidebarOpen(true);
	const closeSidebar = () => setIsSidebarOpen(false);

	const toggleTheme = () => {
		setTheme((prev) => {
			const newTheme = prev === "light" ? "dark" : "light";
			localStorage.setItem("theme", newTheme);
			return newTheme;
		});
	};

	// Compute available years from events
	const availableYears = useMemo(() => getAvailableYears(events), [events]);

	// Apply theme to document root
	useEffect(() => {
		const root = document.documentElement;
		if (theme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
	}, [theme]);

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
				theme,
				toggleTheme,
			}}
		>
			{children}
		</UIContext.Provider>
	);
};
