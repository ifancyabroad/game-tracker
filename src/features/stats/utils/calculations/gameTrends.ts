import type { IEvent, IResult } from "features/events/types";
import type { IGame } from "features/games/types";
import type { MostPlayedGames, TimeSeriesData } from "features/stats/types";
import { formatEventDate } from "common/utils/dateFormatters";
import { parseISO } from "date-fns";
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
 * Sort and limit game data
 */
function sortAndLimitGames(games: MostPlayedGames[], limit: number): MostPlayedGames[] {
	return games.sort((a, b) => b.count - a.count).slice(0, limit);
}

/**
 * Aggregate game counts by date
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

		const formattedDate = formatEventDate(event);
		if (!dateMap[formattedDate]) {
			dateMap[formattedDate] = {};
		}
		dateMap[formattedDate][game.name] = (dateMap[formattedDate][game.name] || 0) + 1;
	});

	return dateMap;
}

/**
 * Convert date map to time series data
 */
function convertToTimeSeriesData(dateMap: Record<string, Record<string, number>>): TimeSeriesData[] {
	return Object.entries(dateMap)
		.map(([date, counts]) => ({ date, ...counts }))
		.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
}

/**
 * Compute most played games from results
 */
export function computeMostPlayedGames(results: IResult[], gameById: Map<string, IGame>): MostPlayedGames[] {
	const gameCounts = countGameOccurrences(results);
	const gamesData = mapGameCountsToDisplay(gameCounts, gameById);
	return sortAndLimitGames(gamesData, 8);
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
