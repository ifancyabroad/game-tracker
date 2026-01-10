import React, { useState, type PropsWithChildren } from "react";
import { UIContext } from "./UIContext";

export const UIProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
	const openSidebar = () => setIsSidebarOpen(true);
	const closeSidebar = () => setIsSidebarOpen(false);

	return (
		<UIContext.Provider
			value={{
				isSidebarOpen,
				toggleSidebar,
				openSidebar,
				closeSidebar,
			}}
		>
			{children}
		</UIContext.Provider>
	);
};
