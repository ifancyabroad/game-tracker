import type { IEvent, IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { TimeSeriesData } from "features/stats/types";
import { getDisplayName } from "features/players/utils/helpers";
import { isPlayerWinner } from "common/utils/gameHelpers";
import { formatEventDate } from "common/utils/dateFormatters";
import { sortEventsByDate } from "common/utils/sorting";
import { parseISO } from "date-fns";

/**
 * Update cumulative wins for a single event
 */
function updateCumulativeWinsForEvent(event: IEvent, results: IResult[], cumulativeWins: Record<string, number>): void {
	const eventResults = results.filter((r) => r.eventId === event.id);
	eventResults.forEach((result) => {
		result.playerResults.forEach((pr) => {
			if (isPlayerWinner(pr)) {
				cumulativeWins[pr.playerId] = (cumulativeWins[pr.playerId] || 0) + 1;
			}
		});
	});
}

/**
 * Snapshot cumulative wins at a specific date
 */
function snapshotWinsAtDate(
	date: string,
	cumulativeWins: Record<string, number>,
	playerById: Map<string, IPlayer>,
	dateMap: Record<string, Record<string, number>>,
): void {
	if (!dateMap[date]) {
		dateMap[date] = {};
	}

	for (const playerId in cumulativeWins) {
		const player = playerById.get(playerId);
		if (!player) continue;
		const name = getDisplayName(player);
		dateMap[date][name] = cumulativeWins[playerId];
	}
}

/**
 * Convert date map to time series data
 */
function convertToTimeSeriesData(dateMap: Record<string, Record<string, number>>): TimeSeriesData[] {
	return Object.entries(dateMap)
		.map(([date, values]) => ({ date, ...values }))
		.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
}

/**
 * Compute player wins over time (cumulative)
 */
export function computePlayerWinsOverTime(
	results: IResult[],
	playerById: Map<string, IPlayer>,
	events: IEvent[],
): TimeSeriesData[] {
	const dateMap: Record<string, Record<string, number>> = {};
	const cumulativeWins: Record<string, number> = {};
	const sortedEvents = sortEventsByDate(events);

	sortedEvents.forEach((event) => {
		const date = formatEventDate(event);
		updateCumulativeWinsForEvent(event, results, cumulativeWins);
		snapshotWinsAtDate(date, cumulativeWins, playerById, dateMap);
	});

	return convertToTimeSeriesData(dateMap);
}
