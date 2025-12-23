import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";

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

export interface IEventPlayerStat {
	playerId: string;
	player: IPlayer | undefined;
	name: string;
	wins: number;
	losses: number;
	gamesPlayed: number;
	points: number;
}

export interface IEventGameStat {
	gameId: string;
	game: IGame | undefined;
	name: string;
	timesPlayed: number;
	winners: (IPlayer | undefined)[];
	losers: (IPlayer | undefined)[];
}
