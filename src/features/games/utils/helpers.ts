import type { IGame } from "features/games/types";

export function getDisplayName(g?: IGame) {
	if (!g) return "Unknown";
	return g.name?.trim() || "Unknown";
}

export const getColorForGame = (game: IGame | undefined) => {
	return game?.color || "var(--color-primary)";
};
