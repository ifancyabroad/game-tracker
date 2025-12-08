export type GameType = "board" | "video";

export interface IGame {
	id: string;
	name: string;
	points: number;
	type: GameType;
	color: string;
}
