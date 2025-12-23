import type { IResult } from "features/events/types";
import type { PlayerEntry } from "features/players/types";

/**
 * Get player entries from all results
 */
export function getPlayerEntries(results: IResult[], playerId: string): PlayerEntry[] {
	const entries: PlayerEntry[] = [];

	for (const r of results) {
		for (const pr of r.playerResults) {
			if (pr.playerId === playerId) {
				entries.push({
					resultId: r.id,
					gameId: r.gameId,
					isWinner: pr.isWinner,
					isLoser: pr.isLoser,
					rank: pr.rank,
					opponents: r.playerResults.filter((opr) => opr.playerId !== playerId).map((opr) => opr.playerId),
				});
			}
		}
	}

	return entries;
}
