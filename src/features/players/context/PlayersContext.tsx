import { createContext, useContext } from "react";
import type { IPlayer } from "features/players/types";

interface PlayersContextValue {
	players: IPlayer[];
	loading: boolean;
	addPlayer: (player: Omit<IPlayer, "id">) => Promise<void>;
	editPlayer: (id: string, player: Partial<IPlayer>) => Promise<void>;
	deletePlayer: (id: string) => Promise<void>;
	uploadImage: (file: File) => Promise<string>;
}

export const PlayersContext = createContext<PlayersContextValue | null>(null);

export const usePlayers = () => {
	const context = useContext(PlayersContext);
	if (!context) {
		throw new Error("usePlayers must be used inside <PlayersProvider>");
	}
	return context;
};
