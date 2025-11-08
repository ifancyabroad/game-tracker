import { useMemo } from "react";
import { computePlayerStats, type PlayerStats } from "./stats";
import type { IPlayer } from "features/players/types";
import type { IResult } from "features/events/types";
import type { IGame } from "features/games/types";

export function usePlayerStatsMap(players: IPlayer[], results: IResult[], games: IGame[]): Map<string, PlayerStats> {
	return useMemo(() => computePlayerStats(players, results, games), [players, results, games]);
}
