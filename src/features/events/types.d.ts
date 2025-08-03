export interface IPlayerGameResult {
	playerId: string;
	rank: number | null;
	isWinner: boolean | null;
	isLoser: boolean | null;
}

export interface IGameResult {
	gameId: string;
	results: IPlayerGameResult[];
}

export interface IEvent {
	id: string;
	location: string;
	date: string; // ISO string or Date depending on your preference
	gameIds: string[];
	playerIds: string[];
	gameResults: IGameResult[] | null;
}
