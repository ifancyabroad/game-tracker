import type { IPlayerResult, IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { TopOpponent } from "features/players/types";
import { getDisplayName } from "../helpers";

/**
 * Check if player won in head-to-head matchup
 */
function checkHeadToHeadWin(me: IPlayerResult, opponent: IPlayerResult): boolean {
	if (me.isWinner && !opponent.isWinner) return true;
	if (!me.isLoser && opponent.isLoser) return true;
	if (me.rank !== null && opponent.rank !== null && me.rank < opponent.rank) return true;
	return false;
}

/**
 * Check if player lost in head-to-head matchup
 */
function checkHeadToHeadLoss(me: IPlayerResult, opponent: IPlayerResult): boolean {
	if (!me.isWinner && opponent.isWinner) return true;
	if (me.isLoser && !opponent.isLoser) return true;
	if (me.rank !== null && opponent.rank !== null && me.rank > opponent.rank) return true;
	return false;
}

/**
 * Build opponent stats tally
 */
function buildOpponentTally(
	results: IResult[],
	playerId: string,
): Record<string, { games: number; wins: number; losses: number }> {
	const tally: Record<string, { games: number; wins: number; losses: number }> = {};

	for (const result of results) {
		const me = result.playerResults.find((pr) => pr.playerId === playerId);
		if (!me) continue;

		for (const pr of result.playerResults) {
			if (pr.playerId === playerId) continue;

			const opponentId = pr.playerId;
			if (!tally[opponentId]) {
				tally[opponentId] = { games: 0, wins: 0, losses: 0 };
			}

			tally[opponentId].games++;
			if (checkHeadToHeadWin(me, pr)) tally[opponentId].wins++;
			if (checkHeadToHeadLoss(me, pr)) tally[opponentId].losses++;
		}
	}

	return tally;
}

/**
 * Convert tally to sorted opponent list
 */
function convertTallyToOpponents(
	tally: Record<string, { games: number; wins: number; losses: number }>,
	playerById: Map<string, IPlayer>,
	limit: number,
): TopOpponent[] {
	const opponents = Object.entries(tally).map(([oppId, stats]) => ({
		opponentId: oppId,
		name: getDisplayName(playerById.get(oppId)),
		games: stats.games,
		wins: stats.wins,
		losses: stats.losses,
	}));

	opponents.sort((a, b) => b.games - a.games || b.wins - a.wins);
	return opponents.slice(0, limit);
}

/**
 * Compute opponent statistics for a player
 */
export function computeOpponentStats(
	results: IResult[],
	playerById: Map<string, IPlayer>,
	playerId: string,
	limit: number = 5,
): TopOpponent[] {
	const tally = buildOpponentTally(results, playerId);
	return convertTallyToOpponents(tally, playerById, limit);
}
