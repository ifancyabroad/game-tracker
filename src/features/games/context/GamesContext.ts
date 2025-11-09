import { createContext, useContext } from "react";
import type { IGame } from "features/games/types";

interface IGamesContext {
	games: IGame[];
	gameById: Map<string, IGame>;
	addGame: (game: Omit<IGame, "id">) => Promise<void>;
	editGame: (id: string, game: Omit<IGame, "id">) => Promise<void>;
	deleteGame: (id: string) => Promise<void>;
}

export const GamesContext = createContext<IGamesContext | null>(null);

export const useGames = (): IGamesContext => {
	const context = useContext(GamesContext);
	if (!context) {
		throw new Error("useGames must be used within a GamesProvider");
	}
	return context;
};
