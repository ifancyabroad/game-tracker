import { createContext, useContext } from "react";
import type { Theme } from "common/utils/theme";

interface IUIContext {
	isSidebarOpen: boolean;
	toggleSidebar: () => void;
	openSidebar: () => void;
	closeSidebar: () => void;
	selectedYear: number | null;
	setSelectedYear: (year: number | null) => void;
	availableYears: number[];
	theme: Theme;
	toggleTheme: () => void;
}

export const UIContext = createContext<IUIContext | null>(null);

export const useUI = () => {
	const context = useContext(UIContext);
	if (!context) {
		throw new Error("useUI must be used within UIProvider");
	}
	return context;
};
