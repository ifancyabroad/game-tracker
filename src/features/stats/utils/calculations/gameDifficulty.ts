import type { IResult } from "features/events/types";
import type { IGame } from "features/games/types";
import { isPlayerWinner } from "common/utils/gameHelpers";

export interface GameDifficulty {
	gameId: string;
	gameName: string;
	color: string;
	totalPlays: number;
	uniqueWinners: number;
	difficultyScore: number;
	label: "One Winner" | "Low" | "Moderate" | "High" | "Very High";
}

/**
 * Calculate game competitiveness based on winner distribution
 * Lower score = dominated by one player
 * Higher score = wins spread across many players (more competitive)
 */
export const computeGameDifficulty = (results: IResult[], gameById: Map<string, IGame>): GameDifficulty[] => {
	// Group results by game
	const gameStats = new Map<string, { plays: number; winners: Set<string> }>();

	results.forEach((result) => {
		const game = gameById.get(result.gameId);
		if (!game) return;

		if (!gameStats.has(result.gameId)) {
			gameStats.set(result.gameId, { plays: 0, winners: new Set() });
		}

		const stats = gameStats.get(result.gameId)!;
		stats.plays++;

		// Track all winners for this game
		result.playerResults.forEach((pr) => {
			if (isPlayerWinner(pr)) {
				stats.winners.add(pr.playerId);
			}
		});
	});

	// Calculate difficulty scores
	const difficulties: GameDifficulty[] = [];

	gameStats.forEach((stats, gameId) => {
		const game = gameById.get(gameId);
		if (!game || stats.plays < 3) return; // Require minimum plays

		const uniqueWinners = stats.winners.size;
		const plays = stats.plays;

		// Difficulty score: higher when more players have won
		// Normalized to 0-100 scale
		const difficultyScore = Math.round((uniqueWinners / plays) * 100);

		// Categorize competitiveness
		let label: GameDifficulty["label"];
		if (difficultyScore < 20) {
			label = "One Winner";
		} else if (difficultyScore < 40) {
			label = "Low";
		} else if (difficultyScore < 60) {
			label = "Moderate";
		} else if (difficultyScore < 80) {
			label = "High";
		} else {
			label = "Very High";
		}

		difficulties.push({
			gameId,
			gameName: game.name,
			color: game.color,
			totalPlays: plays,
			uniqueWinners,
			difficultyScore,
			label,
		});
	});

	// Sort by difficulty score descending (hardest first)
	return difficulties.sort((a, b) => b.difficultyScore - a.difficultyScore);
};
