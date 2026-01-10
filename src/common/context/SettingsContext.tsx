import { createContext, useContext } from "react";
import type { IAppSettings, ILeaderboard } from "features/settings/types";

export interface SettingsContextValue {
	settings: IAppSettings | null;
	loading: boolean;
	updateSettings: (updates: Partial<IAppSettings>) => Promise<void>;
	uploadLogo: (file: File, onProgress?: (progress: number) => void) => Promise<string>;
	addGameTag: (tag: string) => Promise<void>;
	deleteGameTag: (tag: string) => Promise<{ usageCount: number; affectedGames: string[] }>;
	addLeaderboard: (leaderboard: Omit<ILeaderboard, "id">) => Promise<void>;
	editLeaderboard: (id: string, updates: Partial<Omit<ILeaderboard, "id">>) => Promise<void>;
	deleteLeaderboard: (id: string) => Promise<void>;
	setDefaultLeaderboard: (id: string) => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function useSettings() {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
}
