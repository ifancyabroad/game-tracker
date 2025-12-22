export interface IEvent {
	id: string;
	location: string;
	date: string; // ISO string or Date depending on your preference
	gameIds: string[];
	playerIds: string[];
	notes?: string | null;
}

export interface IPlayerResult {
	playerId: string;
	rank: number | null;
	isWinner: boolean | null;
	isLoser: boolean | null;
}

export interface IResult {
	id: string;
	eventId: string;
	gameId: string;
	order: number;
	playerResults: IPlayerResult[];
	notes?: string | null;
}
