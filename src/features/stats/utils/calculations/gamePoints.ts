import type { IResult } from "features/events/types";
import type { IGame } from "features/games/types";

export interface GamePointsData {
	gameId: string;
	gameName: string;
	color: string;
	totalPoints: number;
	timesPlayed: number;
}

/**
 * Calculate total points earned from each game
 * Points are awarded based on game.points value for each play
 */
export const computeGamePoints = (results: IResult[], gameById: Map<string, IGame>): GamePointsData[] => {
	// Group results by game
	const gameStats = new Map<string, { plays: number; totalPoints: number }>();

	results.forEach((result) => {
		const game = gameById.get(result.gameId);
		if (!game) return;

		if (!gameStats.has(result.gameId)) {
			gameStats.set(result.gameId, { plays: 0, totalPoints: 0 });
		}

		const stats = gameStats.get(result.gameId)!;
		stats.plays++;
		stats.totalPoints += game.points;
	});

	// Convert to array and sort by total points
	const gamePointsData: GamePointsData[] = [];

	gameStats.forEach((stats, gameId) => {
		const game = gameById.get(gameId);
		if (!game) return;

		gamePointsData.push({
			gameId,
			gameName: game.name,
			color: game.color,
			totalPoints: stats.totalPoints,
			timesPlayed: stats.plays,
		});
	});

	// Sort by total points descending
	return gamePointsData.sort((a, b) => b.totalPoints - a.totalPoints);
};
