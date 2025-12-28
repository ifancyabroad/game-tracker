import type { IEvent, IResult } from "features/events/types";
import type { IGame } from "features/games/types";
import type { MostPlayedGames, TimeSeriesData } from "features/stats/types";
import { format, parseISO } from "date-fns";
import { getColorForGame, getDisplayName } from "features/games/utils/helpers";

/**
 * Count games by ID
 */
function countGameOccurrences(results: IResult[]): Record<string, number> {
	const gameCount: Record<string, number> = {};
	results.forEach((r) => {
		gameCount[r.gameId] = (gameCount[r.gameId] || 0) + 1;
	});
	return gameCount;
}

/**
 * Map game counts to display format
 */
function mapGameCountsToDisplay(gameCounts: Record<string, number>, gameById: Map<string, IGame>): MostPlayedGames[] {
	return Object.entries(gameCounts).map(([gameId, count]) => {
		const game = gameById.get(gameId);
		return {
			name: getDisplayName(game),
			color: getColorForGame(game),
			count,
		};
	});
}

/**
 * Aggregate game counts by date with cumulative totals
 */
function aggregateGamesByDate(
	results: IResult[],
	gameById: Map<string, IGame>,
	eventById: Map<string, IEvent>,
): Record<string, Record<string, number>> {
	const dateMap: Record<string, Record<string, number>> = {};

	results.forEach((result) => {
		const event = eventById.get(result.eventId);
		const game = gameById.get(result.gameId);
		if (!event || !game) return;

		// Use ISO date for sorting, not formatted date
		const isoDate = event.date;
		if (!dateMap[isoDate]) {
			dateMap[isoDate] = {};
		}
		dateMap[isoDate][game.name] = (dateMap[isoDate][game.name] || 0) + 1;
	});

	return dateMap;
}

/**
 * Convert date map to cumulative time series data
 */
function convertToTimeSeriesData(dateMap: Record<string, Record<string, number>>): TimeSeriesData[] {
	// Convert ISO dates to Date objects for proper sorting
	const entries = Object.entries(dateMap).map(([isoDate, counts]) => ({
		dateObj: parseISO(isoDate),
		isoDate,
		counts,
	}));

	// Sort by actual Date objects
	entries.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

	// Calculate cumulative totals for each game
	const cumulativeTotals: Record<string, number> = {};
	const allGames = new Set<string>();

	// Collect all game names
	entries.forEach(({ counts }) => {
		Object.keys(counts).forEach((game) => allGames.add(game));
	});

	// Build cumulative data
	return entries.map(({ dateObj, counts }) => {
		const dataPoint: TimeSeriesData = {
			date: format(dateObj, "MMM d"),
		};

		// Update cumulative totals for games played on this date
		Object.entries(counts).forEach(([game, count]) => {
			cumulativeTotals[game] = (cumulativeTotals[game] || 0) + count;
		});

		// Only include games that have been played at least once up to this point
		Object.keys(cumulativeTotals).forEach((game) => {
			dataPoint[game] = cumulativeTotals[game];
		});

		return dataPoint;
	});
}

/**
 * Compute most played games from results
 */
export function computeMostPlayedGames(results: IResult[], gameById: Map<string, IGame>): MostPlayedGames[] {
	const gameCounts = countGameOccurrences(results);
	const gamesData = mapGameCountsToDisplay(gameCounts, gameById);
	return gamesData.sort((a, b) => b.count - a.count);
}

/**
 * Compute game play trends over time
 */
export function computeGameTrendsOverTime(
	results: IResult[],
	gameById: Map<string, IGame>,
	eventById: Map<string, IEvent>,
): TimeSeriesData[] {
	const dateMap = aggregateGamesByDate(results, gameById, eventById);
	return convertToTimeSeriesData(dateMap);
}
