export interface IGame {
	id: string;
	name: string;
	points: number;
	tags: string[];
	color: string;
}

export interface GameData {
	gameId: string;
	name: string;
	points: number;
	timesPlayed: number;
	totalPointsAwarded: number;
	uniquePlayers: number;
	avgPlayersPerGame: number;
}

export interface GameWithData extends IGame {
	data: GameData;
}

export interface PlayerGameStats {
	playerId: string;
	name: string;
	color: string;
	games: number;
	wins: number;
	winRate: number;
	points: number;
	avgRank: number;
}

export interface GameAggregates {
	topPlayer?: PlayerGameStats;
	bottomPlayer?: PlayerGameStats;
	playerStats: PlayerGameStats[];
	playFrequencySeries: Array<{ date: string; plays: number }>;
	rankDistribution: Array<{ rank: number; count: number }>;
}
