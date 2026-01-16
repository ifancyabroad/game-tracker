export type LeaderboardStatus = "scheduled" | "active" | "complete";

export interface ILeaderboard {
	id: string;
	name: string;
	gameTags: string[]; // Filter by tags (empty = all games)
	playerIds: string[]; // Filter by IDs (empty = all players)
	startDate?: string; // ISO string, nullable
	endDate?: string; // ISO string, nullable
	isDefault: boolean;
}

export interface IAppSettings {
	appName: string;
	logoUrl: string | null;
	themeName: string; // One of the THEMES keys
	gameTags: string[]; // Global available tags for games
	leaderboards: ILeaderboard[]; // Configured leaderboards
	updatedAt?: string;
	updatedBy?: string;
}
