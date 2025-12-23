export interface MostPlayedGames {
	name: string;
	count: number;
	color: string;
}

export interface TimeSeriesData {
	date: string;
	[key: string]: number | string;
}

export interface FeaturedStats {
	totalGamesPlayed: number;
	totalEvents: number;
	totalPlayersInvolved: number;
}

export interface StreakPlayer {
	playerId: string;
	playerName: string;
	playerColor: string;
	streak: number;
}

export interface StreakStats {
	currentStreak: number;
	maxStreak: number;
}
