import { createContext, useContext } from "react";
import type { IAppSettings } from "features/settings/types";

export interface SettingsContextValue {
	settings: IAppSettings | null;
	loading: boolean;
	updateSettings: (updates: Partial<IAppSettings>) => Promise<void>;
	uploadLogo: (file: File, onProgress?: (progress: number) => void) => Promise<string>;
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function useSettings() {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
}
