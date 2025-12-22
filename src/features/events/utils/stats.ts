import type { IEvent, IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";
import { isPlayerWinner } from "common/utils/gameHelpers";
import { getDisplayName } from "features/players/utils/helpers";

export function sortResults(results: IResult[], eventById: Map<string, IEvent>): IResult[] {
	return results.slice().sort((a, b) => {
		const eventA = eventById.get(a.eventId);
		const eventB = eventById.get(b.eventId);
		if (eventA && eventB) {
			const dateA = new Date(eventA.date).getTime();
			const dateB = new Date(eventB.date).getTime();
			return dateA === dateB ? a.order - b.order : dateA - dateB;
		} else if (eventA) {
			return -1;
		} else if (eventB) {
			return 1;
		}
		return 0;
	});
}

export function sortEvents(events: IEvent[]): IEvent[] {
	return events.slice().sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
}

export interface IEventPlayerStat {
	playerId: string;
	player: IPlayer | undefined;
	name: string;
	wins: number;
	losses: number;
	gamesPlayed: number;
	points: number;
}

export interface IEventGameStat {
	gameId: string;
	game: IGame | undefined;
	name: string;
	timesPlayed: number;
	winners: (IPlayer | undefined)[];
	losers: (IPlayer | undefined)[];
}

export function getEventPlayerStats(
	event: IEvent,
	eventResults: IResult[],
	playerById: Map<string, IPlayer>,
	gameById: Map<string, IGame>,
): IEventPlayerStat[] {
	return event.playerIds.map((playerId) => {
		const player = playerById.get(playerId);
		let wins = 0;
		let losses = 0;
		let gamesPlayed = 0;
		let points = 0;

		eventResults.forEach((result) => {
			const playerResult = result.playerResults.find((pr) => pr.playerId === playerId);
			if (playerResult) {
				const game = gameById.get(result.gameId);
				const gamePoints = game?.points || 0;
				gamesPlayed++;
				if (isPlayerWinner(playerResult)) {
					wins++;
					points += gamePoints;
				}
				if (playerResult.isLoser) {
					losses++;
					points -= gamePoints;
				}
			}
		});

		return {
			playerId,
			player,
			name: getDisplayName(player),
			wins,
			losses,
			gamesPlayed,
			points,
		};
	});
}

export function sortEventPlayerStats(stats: IEventPlayerStat[]): IEventPlayerStat[] {
	return stats.slice().sort((a, b) => {
		// Sort by points (descending), then by wins (descending), then by name
		if (b.points !== a.points) return b.points - a.points;
		if (b.wins !== a.wins) return b.wins - a.wins;
		return a.name.localeCompare(b.name);
	});
}

export function sortEventGameStats(stats: IEventGameStat[]): IEventGameStat[] {
	return stats.slice().sort((a, b) => {
		// Sort by times played (descending), then by name
		if (b.timesPlayed !== a.timesPlayed) return b.timesPlayed - a.timesPlayed;
		return a.name.localeCompare(b.name);
	});
}

export function getEventGameStats(
	event: IEvent,
	eventResults: IResult[],
	gameById: Map<string, IGame>,
	playerById: Map<string, IPlayer>,
): IEventGameStat[] {
	return event.gameIds.map((gameId) => {
		const game = gameById.get(gameId);
		const gameResults = eventResults.filter((r) => r.gameId === gameId);
		const timesPlayed = gameResults.length;

		// Get winners for each result
		const winners = gameResults
			.map((result) => {
				const winningResults = result.playerResults.filter(isPlayerWinner);
				return winningResults.map((pr) => playerById.get(pr.playerId));
			})
			.flat()
			.filter(Boolean);

		// Get losers for each result
		const losers = gameResults
			.map((result) => {
				const losingResults = result.playerResults.filter((pr) => pr.isLoser);
				return losingResults.map((pr) => playerById.get(pr.playerId));
			})
			.flat()
			.filter(Boolean);

		return {
			gameId,
			game,
			name: game?.name || "Unknown",
			timesPlayed,
			winners,
			losers,
		};
	});
}

/**
 * Get and sort event player stats (combines getEventPlayerStats + sortEventPlayerStats)
 */
export function getSortedEventPlayerStats(
	eventId: string,
	eventById: Map<string, IEvent>,
	results: IResult[],
	playerById: Map<string, IPlayer>,
	gameById: Map<string, IGame>,
): IEventPlayerStat[] {
	const event = eventById.get(eventId);
	if (!event) return [];
	const eventResults = results.filter((r) => r.eventId === eventId);
	const stats = getEventPlayerStats(event, eventResults, playerById, gameById);
	return sortEventPlayerStats(stats);
}

/**
 * Get and sort event game stats (combines getEventGameStats + sortEventGameStats)
 */
export function getSortedEventGameStats(
	eventId: string,
	eventById: Map<string, IEvent>,
	results: IResult[],
	gameById: Map<string, IGame>,
	playerById: Map<string, IPlayer>,
): IEventGameStat[] {
	const event = eventById.get(eventId);
	if (!event) return [];
	const eventResults = results.filter((r) => r.eventId === eventId);
	const stats = getEventGameStats(event, eventResults, gameById, playerById);
	return sortEventGameStats(stats);
}
