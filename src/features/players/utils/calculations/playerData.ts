import type { IResult, IEvent } from "features/events/types";
import type { BestGame, IPlayer, PlayerData, PlayerWithData } from "features/players/types";
import type { IGame } from "features/games/types";
import { getColorForPlayer, getDisplayName, getFullName } from "../helpers";
import { isPlayerWinner } from "common/utils/gameHelpers";
import { calculateWinRate, calculateWinRatePercent } from "common/utils/calculations";
import { sortEventsByDate } from "common/utils/sorting";
import { DISPLAY_LIMITS } from "common/utils/constants";
import { isAfter, isBefore, parseISO } from "date-fns";

interface PlayerStatsAccumulator {
	wins: number;
	games: number;
	points: number;
}

export interface LeaderboardFilters {
	gameTags?: string[]; // Empty or undefined = all games
	playerIds?: string[]; // Empty or undefined = all players
	startDate?: string; // ISO string
	endDate?: string; // ISO string
}

/**
 * Create stats accumulator
 */
function createStatsAccumulator(): PlayerStatsAccumulator {
	return { wins: 0, games: 0, points: 0 };
}

/**
 * Check if game matches tag filter
 */
function shouldIncludeGame(game: IGame | undefined, filters: LeaderboardFilters): boolean {
	if (!game) return false;

	// If no tag filter or empty array, include all games
	if (!filters.gameTags || filters.gameTags.length === 0) return true;

	// Check if game has any of the filter tags
	if (!game.tags || game.tags.length === 0) return false;
	return game.tags.some((tag) => filters.gameTags!.includes(tag));
}

/**
 * Check if player should be included
 */
function shouldIncludePlayer(playerId: string, filters: LeaderboardFilters): boolean {
	// If no player filter or empty array, include all players
	if (!filters.playerIds || filters.playerIds.length === 0) return true;
	return filters.playerIds.includes(playerId);
}

/**
 * Check if event is within date range
 */
function shouldIncludeEvent(event: IEvent, filters: LeaderboardFilters): boolean {
	if (!filters.startDate && !filters.endDate) return true;

	const eventDate = parseISO(event.date);

	if (filters.startDate) {
		const start = parseISO(filters.startDate);
		if (isBefore(eventDate, start)) return false;
	}

	if (filters.endDate) {
		const end = parseISO(filters.endDate);
		if (isAfter(eventDate, end)) return false;
	}

	return true;
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
	filters: LeaderboardFilters,
): (number | null)[] {
	// Filter events by date range first
	const filteredEvents = events.filter((event) => shouldIncludeEvent(event, filters));
	const sortedEvents = sortEventsByDate(filteredEvents, true); // Sort descending (newest first)
	const recentEvents = sortedEvents.slice(0, DISPLAY_LIMITS.UI.RECENT_EVENTS);

	return recentEvents.map((event) => {
		let eventPoints = 0;
		let playerAttended = false;

		results.forEach((result) => {
			if (result.eventId !== event.id) return;

			const game = gameById.get(result.gameId);
			if (!shouldIncludeGame(game, filters)) return;

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
	filters: LeaderboardFilters,
): BestGame | null {
	// Track total points per game
	const gamePoints = new Map<string, number>();

	results.forEach((result) => {
		const game = gameById.get(result.gameId);
		if (!shouldIncludeGame(game, filters)) return;
		if (!game) return;

		const playerResult = result.playerResults.find((pr) => pr.playerId === playerId);
		if (!playerResult || !isPlayerWinner(playerResult)) return;

		// Add this win's points to the game's total
		const currentPoints = gamePoints.get(game.id) || 0;
		gamePoints.set(game.id, currentPoints + game.points);
	});

	// Find game with highest total points
	let bestGame: BestGame | null = null;
	let maxPoints = 0;

	gamePoints.forEach((points, gameId) => {
		if (points > maxPoints) {
			const game = gameById.get(gameId);
			if (game) {
				maxPoints = points;
				bestGame = {
					gameId: game.id,
					gameName: game.name,
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
	filters: LeaderboardFilters = {},
): PlayerWithData[] {
	const statsMap = new Map<string, PlayerStatsAccumulator>();

	// Filter events by date range
	const filteredEventIds = new Set(events.filter((event) => shouldIncludeEvent(event, filters)).map((e) => e.id));

	results.forEach((result) => {
		// Skip results from events outside date range
		if (!filteredEventIds.has(result.eventId)) return;

		const game = gameById.get(result.gameId);

		// Filter by game tags
		if (!shouldIncludeGame(game, filters)) {
			return;
		}

		result.playerResults.forEach((pr) => {
			// Filter by player IDs
			if (!shouldIncludePlayer(pr.playerId, filters)) return;

			let stats = statsMap.get(pr.playerId);
			if (!stats) {
				stats = createStatsAccumulator();
				statsMap.set(pr.playerId, stats);
			}

			updateStatsWithResult(stats, pr, game);
		});
	});

	// Filter players list
	const filteredPlayers = players.filter((p) => shouldIncludePlayer(p.id, filters));

	return filteredPlayers.map((player) => {
		const stats = statsMap.get(player.id) || createStatsAccumulator();
		const recentForm = calculateRecentForm(player.id, events, results, gameById, filters);
		const bestGame = findBestGame(player.id, results, gameById, filters);
		return {
			...player,
			data: convertToPlayerData(player, stats, recentForm, bestGame),
		};
	});
}
