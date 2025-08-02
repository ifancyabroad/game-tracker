export interface IPlayer {
	id: string;
	name: string;
	preferredName: string;
	pictureUrl?: string;
}

export interface IGame {
	id: string;
	name: string;
}

export interface IGameResult {
	playerId: string;
	rank?: number;
	isWinner?: boolean;
	isLoser?: boolean;
}

export interface IEventGame {
	gameId: string;
	results: GameResult[];
}

export interface IEvent {
	id: string;
	location: string;
	date: string; // ISO format
	games: IEventGame[];
	players: string[]; // Player IDs
}
