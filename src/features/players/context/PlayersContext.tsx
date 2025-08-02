import { createContext, useContext } from "react";
import type { IPlayer } from "features/players/types";

interface PlayersContextValue {
	players: IPlayer[];
	loading: boolean;
	addPlayer: (player: Omit<IPlayer, "id">) => Promise<void>;
	editPlayer: (id: string, player: Partial<IPlayer>) => Promise<void>;
	deletePlayer: (id: string) => Promise<void>;
}

export const PlayersContext = createContext<PlayersContextValue | null>(null);

export function usePlayers() {
	const ctx = useContext(PlayersContext);
	if (!ctx) throw new Error("usePlayers must be used inside <PlayersProvider>");
	return ctx;
}
