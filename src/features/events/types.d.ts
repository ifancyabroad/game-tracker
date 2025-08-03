export interface IGameResult {
	gameId: string;
	results: {
		playerId: string;
		rank?: number;
		isWinner?: boolean;
		isLoser?: boolean;
	}[];
}

export interface IEvent {
	id: string;
	location: string;
	date: string; // ISO string or Date depending on your preference
	gameIds: string[];
	playerIds: string[];
	gameResults?: IGameResult[];
}
