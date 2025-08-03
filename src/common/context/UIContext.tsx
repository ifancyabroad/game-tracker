import { createContext, useContext } from "react";

interface IUIContext {
	isSidebarOpen: boolean;
	toggleSidebar: () => void;
	openSidebar: () => void;
	closeSidebar: () => void;
}

export const UIContext = createContext<IUIContext | null>(null);

export const useUI = () => {
	const context = useContext(UIContext);
	if (!context) {
		throw new Error("useUI must be used within UIProvider");
	}
	return context;
};
