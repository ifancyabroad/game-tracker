import { useMemo } from "react";
import type { IResult } from "features/events/types";
import type { IGame } from "features/games/types";
import { aggregatePlayerStatsForPage } from "./stats";

export function usePlayerPageStats(playerId: string, results: IResult[], games: IGame[]) {
	return useMemo(() => aggregatePlayerStatsForPage(results, games, playerId), [results, games, playerId]);
}
