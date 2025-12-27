import type { IEvent } from "features/events/types";
import type { IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { PlayerAttendance } from "features/stats/components/PlayerAttendanceCard";

/**
 * Calculate player participation rates by games played
 */
export const computePlayerAttendance = (
	results: IResult[],
	events: IEvent[],
	playerById: Map<string, IPlayer>,
	limit: number = 5,
): PlayerAttendance[] => {
	if (results.length === 0) return [];

	const playerGameCounts = new Map<string, number>();
	const playerEventCounts = new Map<string, number>();

	// Count games for each player
	results.forEach((result) => {
		result.playerResults.forEach((pr) => {
			playerGameCounts.set(pr.playerId, (playerGameCounts.get(pr.playerId) || 0) + 1);
		});
	});

	// Count events for each player
	events.forEach((event) => {
		event.playerIds.forEach((playerId) => {
			playerEventCounts.set(playerId, (playerEventCounts.get(playerId) || 0) + 1);
		});
	});

	// Find max games for percentage calculation
	const maxGames = Math.max(...Array.from(playerGameCounts.values()));

	// Convert to attendance objects
	const attendances: PlayerAttendance[] = [];

	playerGameCounts.forEach((gamesPlayed, playerId) => {
		const player = playerById.get(playerId);
		if (!player) return;

		const eventsAttended = playerEventCounts.get(playerId) || 0;
		const attendanceRate = maxGames > 0 ? (gamesPlayed / maxGames) * 100 : 0;

		attendances.push({
			playerId,
			playerName: player.preferredName || player.firstName,
			pictureUrl: player.pictureUrl ? player.pictureUrl : undefined,
			color: player.color,
			eventsAttended,
			totalEvents: gamesPlayed,
			attendanceRate,
		});
	});

	// Sort by attendance rate descending, then by events attended
	return attendances
		.sort((a, b) => {
			if (b.attendanceRate !== a.attendanceRate) {
				return b.attendanceRate - a.attendanceRate;
			}
			return b.eventsAttended - a.eventsAttended;
		})
		.slice(0, limit);
};
