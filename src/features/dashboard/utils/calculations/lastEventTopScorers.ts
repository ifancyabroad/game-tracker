import { isPlayerWinner } from "common/utils/gameHelpers";
import { getDisplayName } from "features/players/utils/helpers";
import type { IPlayer } from "features/players/types";
import type { IEvent, IResult } from "features/events/types";
import type { IGame } from "features/games/types";

export interface IPointScorer {
	player: IPlayer;
	points: number;
}

/**
 * Calculate the highest point scorer(s) from a specific event
 */
export function getLastEventTopScorers(
	events: IEvent[],
	results: IResult[],
	playerById: Map<string, IPlayer>,
	gameById: Map<string, IGame>,
): IPointScorer[] {
	if (events.length === 0) return [];

	const lastEvent = events[0];
	const eventResults = results.filter((r) => r.eventId === lastEvent.id);

	// Calculate points per player
	const playerPoints = new Map<string, number>();

	eventResults.forEach((result) => {
		const game = gameById.get(result.gameId);
		if (!game) return;

		result.playerResults.forEach((pr) => {
			if (isPlayerWinner(pr)) {
				const currentPoints = playerPoints.get(pr.playerId) || 0;
				playerPoints.set(pr.playerId, currentPoints + game.points);
			}
		});
	});

	if (playerPoints.size === 0) return [];

	// Find max points
	const maxPoints = Math.max(...Array.from(playerPoints.values()));

	// Get all players with max points
	const topScorers: IPointScorer[] = [];
	playerPoints.forEach((points, playerId) => {
		if (points === maxPoints) {
			const player = playerById.get(playerId);
			if (player) {
				topScorers.push({ player, points });
			}
		}
	});

	return topScorers.sort((a, b) => getDisplayName(a.player).localeCompare(getDisplayName(b.player)));
}
