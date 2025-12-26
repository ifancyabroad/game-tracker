import type { IResult, IEvent } from "features/events/types";
import type { BestGame, IPlayer, PlayerData, PlayerWithData } from "features/players/types";
import type { GameType, IGame } from "features/games/types";
import { getColorForPlayer, getDisplayName, getFullName } from "../helpers";
import { isPlayerWinner } from "common/utils/gameHelpers";
import { calculateWinRate, calculateWinRatePercent } from "common/utils/calculations";
import { sortEventsByDate } from "common/utils/sorting";

interface PlayerStatsAccumulator {
	wins: number;
	games: number;
	points: number;
}

/**
 * Create stats accumulator
 */
function createStatsAccumulator(): PlayerStatsAccumulator {
	return { wins: 0, games: 0, points: 0 };
}

/**
 * Check if game matches type filter
 */
function shouldIncludeGame(game: IGame | undefined, gameType: GameType | undefined): boolean {
	if (!gameType) return true;
	if (!game) return false;
	return game.type === gameType;
}

/**
 * Update stats with player result
 */
function updateStatsWithResult(
	stats: PlayerStatsAccumulator,
	pr: import("features/events/types").IPlayerResult,
	game: IGame | undefined,
): void {
	stats.games += 1;

	if (isPlayerWinner(pr)) {
		stats.wins += 1;
		if (game) {
			stats.points += game.points;
		}
	}

	if (pr.isLoser && game) {
		stats.points -= game.points;
	}
}

/**
 * Calculate recent form (points from last 3 events)
 */
function calculateRecentForm(
	playerId: string,
	events: IEvent[],
	results: IResult[],
	gameById: Map<string, IGame>,
	gameType?: GameType,
): (number | null)[] {
	const sortedEvents = sortEventsByDate(events, true); // Sort descending (newest first)
	const recentEvents = sortedEvents.slice(0, 3);

	return recentEvents.map((event) => {
		let eventPoints = 0;
		let playerAttended = false;

		results.forEach((result) => {
			if (result.eventId !== event.id) return;

			const game = gameById.get(result.gameId);
			if (!shouldIncludeGame(game, gameType)) return;

			const playerResult = result.playerResults.find((pr) => pr.playerId === playerId);
			if (!playerResult) return;

			playerAttended = true;

			if (isPlayerWinner(playerResult) && game) {
				eventPoints += game.points;
			}
			if (playerResult.isLoser && game) {
				eventPoints -= game.points;
			}
		});

		return playerAttended ? eventPoints : null;
	});
}

/**
 * Find best game (game where player scored most total points)
 */
function findBestGame(
	playerId: string,
	results: IResult[],
	gameById: Map<string, IGame>,
	gameType?: GameType,
): BestGame | null {
	// Track total points per game
	const gamePoints = new Map<string, number>();

	results.forEach((result) => {
		const game = gameById.get(result.gameId);
		if (!shouldIncludeGame(game, gameType)) return;
		if (!game) return;

		const playerResult = result.playerResults.find((pr) => pr.playerId === playerId);
		if (!playerResult || !isPlayerWinner(playerResult)) return;

		// Add this win's points to the game's total
		const currentPoints = gamePoints.get(game.id) || 0;
		gamePoints.set(game.id, currentPoints + game.points);
	});

	// Find game with highest total points
	let bestGame: { gameId: string; gameName: string; gameType: "board" | "video"; points: number } | null = null;
	let maxPoints = 0;

	gamePoints.forEach((points, gameId) => {
		if (points > maxPoints) {
			const game = gameById.get(gameId);
			if (game) {
				maxPoints = points;
				bestGame = {
					gameId: game.id,
					gameName: game.name,
					gameType: game.type,
					points: points,
				};
			}
		}
	});

	return bestGame;
}

/**
 * Convert stats to player data
 */
function convertToPlayerData(
	player: IPlayer,
	stats: PlayerStatsAccumulator,
	recentForm: (number | null)[],
	bestGame: BestGame | null,
): PlayerData {
	const winRate = calculateWinRate(stats.wins, stats.games);
	const winRatePercent = calculateWinRatePercent(stats.wins, stats.games);

	return {
		playerId: player.id,
		name: getDisplayName(player),
		fullName: getFullName(player),
		color: getColorForPlayer(player),
		points: stats.points,
		wins: stats.wins,
		games: stats.games,
		winRate,
		winRatePercent,
		recentForm,
		bestGame,
	};
}

/**
 * Compute player data for all players
 */
export function computePlayerData(
	players: IPlayer[],
	results: IResult[],
	gameById: Map<string, IGame>,
	events: IEvent[],
	gameType?: GameType,
): PlayerWithData[] {
	const statsMap = new Map<string, PlayerStatsAccumulator>();

	results.forEach((result) => {
		const game = gameById.get(result.gameId);

		// Filter by game type if specified
		if (!shouldIncludeGame(game, gameType)) {
			return;
		}

		result.playerResults.forEach((pr) => {
			let stats = statsMap.get(pr.playerId);
			if (!stats) {
				stats = createStatsAccumulator();
				statsMap.set(pr.playerId, stats);
			}

			updateStatsWithResult(stats, pr, game);
		});
	});

	return players.map((player) => {
		const stats = statsMap.get(player.id) || createStatsAccumulator();
		const recentForm = calculateRecentForm(player.id, events, results, gameById, gameType);
		const bestGame = findBestGame(player.id, results, gameById, gameType);
		return {
			...player,
			data: convertToPlayerData(player, stats, recentForm, bestGame),
		};
	});
}
