import type { IResult } from "features/events/types";
import type { IPlayer } from "features/players/types";
import { isPlayerWinner } from "common/utils/gameHelpers";

export interface HeadToHeadRecord {
	wins: number;
	losses: number;
	total: number;
	winRate: number;
}

export interface RivalryData {
	playerId: string;
	playerName: string;
	color: string;
	opponents: Map<string, HeadToHeadRecord>;
}

export interface TopRivalry {
	player1Id: string;
	player1Name: string;
	player1Color: string;
	player1PictureUrl?: string;
	player2Id: string;
	player2Name: string;
	player2Color: string;
	player2PictureUrl?: string;
	totalGames: number;
	player1Wins: number;
	player2Wins: number;
	closeness: number; // 0-100, 100 = perfectly even
}

/**
 * Build rivalry matrix for all players
 */
export const buildRivalryMatrix = (results: IResult[], playerById: Map<string, IPlayer>): RivalryData[] => {
	// Map of playerId -> Map of opponentId -> record
	const rivalries = new Map<string, Map<string, { wins: number; losses: number; total: number }>>();

	// Process each result
	results.forEach((result) => {
		// Get all player IDs and their winner status
		const playerStatuses = result.playerResults.map((pr) => ({
			playerId: pr.playerId,
			isWinner: isPlayerWinner(pr),
		}));

		// For each player pair in this game
		for (let i = 0; i < playerStatuses.length; i++) {
			const player1 = playerStatuses[i];

			// Initialize player1's rivalry map if needed
			if (!rivalries.has(player1.playerId)) {
				rivalries.set(player1.playerId, new Map());
			}
			const player1Rivalries = rivalries.get(player1.playerId)!;

			for (let j = 0; j < playerStatuses.length; j++) {
				if (i === j) continue; // Skip self

				const player2 = playerStatuses[j];

				// Initialize record if needed
				if (!player1Rivalries.has(player2.playerId)) {
					player1Rivalries.set(player2.playerId, { wins: 0, losses: 0, total: 0 });
				}

				const record = player1Rivalries.get(player2.playerId)!;
				record.total++;

				// Update wins/losses
				if (player1.isWinner && !player2.isWinner) {
					record.wins++;
				} else if (!player1.isWinner && player2.isWinner) {
					record.losses++;
				}
			}
		}
	});

	// Convert to RivalryData array
	const rivalryData: RivalryData[] = [];

	rivalries.forEach((opponents, playerId) => {
		const player = playerById.get(playerId);
		if (!player) return;

		const opponentsMap = new Map<string, HeadToHeadRecord>();

		opponents.forEach((record, opponentId) => {
			const winRate = record.total === 0 ? 0 : (record.wins / record.total) * 100;
			opponentsMap.set(opponentId, {
				wins: record.wins,
				losses: record.losses,
				total: record.total,
				winRate,
			});
		});

		rivalryData.push({
			playerId,
			playerName: player.preferredName || player.firstName,
			color: player.color,
			opponents: opponentsMap,
		});
	});

	return rivalryData;
};

/**
 * Find the most competitive rivalries (most even records)
 */
export const getTopRivalries = (
	results: IResult[],
	playerById: Map<string, IPlayer>,
	limit: number = 5,
): TopRivalry[] => {
	// Track head-to-head games between each pair
	const pairStats = new Map<
		string,
		{
			player1Id: string;
			player2Id: string;
			player1Wins: number;
			player2Wins: number;
			totalGames: number;
		}
	>();

	results.forEach((result) => {
		const playerStatuses = result.playerResults.map((pr) => ({
			playerId: pr.playerId,
			isWinner: isPlayerWinner(pr),
		}));

		// For each unique pair
		for (let i = 0; i < playerStatuses.length; i++) {
			for (let j = i + 1; j < playerStatuses.length; j++) {
				const player1 = playerStatuses[i];
				const player2 = playerStatuses[j];

				// Create consistent pair key (sorted IDs)
				const pairKey = [player1.playerId, player2.playerId].sort().join("-");

				if (!pairStats.has(pairKey)) {
					pairStats.set(pairKey, {
						player1Id: player1.playerId,
						player2Id: player2.playerId,
						player1Wins: 0,
						player2Wins: 0,
						totalGames: 0,
					});
				}

				const stats = pairStats.get(pairKey)!;
				stats.totalGames++;

				// Update wins
				if (player1.isWinner && !player2.isWinner) {
					if (stats.player1Id === player1.playerId) {
						stats.player1Wins++;
					} else {
						stats.player2Wins++;
					}
				} else if (!player1.isWinner && player2.isWinner) {
					if (stats.player1Id === player1.playerId) {
						stats.player2Wins++;
					} else {
						stats.player1Wins++;
					}
				}
			}
		}
	});

	// Convert to TopRivalry array with closeness metric
	const rivalries: TopRivalry[] = [];

	pairStats.forEach((stats) => {
		const player1 = playerById.get(stats.player1Id);
		const player2 = playerById.get(stats.player2Id);
		if (!player1 || !player2 || stats.totalGames < 3) return; // Minimum 3 games

		// Closeness: 100 = perfectly even, 0 = one player dominates
		const winDiff = Math.abs(stats.player1Wins - stats.player2Wins);
		const closeness = Math.max(0, 100 - (winDiff / stats.totalGames) * 100);

		rivalries.push({
			player1Id: stats.player1Id,
			player1Name: player1.preferredName || player1.firstName,
			player1Color: player1.color,
			player1PictureUrl: player1.pictureUrl ? player1.pictureUrl : undefined,
			player2Id: stats.player2Id,
			player2Name: player2.preferredName || player2.firstName,
			player2Color: player2.color,
			player2PictureUrl: player2.pictureUrl ? player2.pictureUrl : undefined,
			totalGames: stats.totalGames,
			player1Wins: stats.player1Wins,
			player2Wins: stats.player2Wins,
			closeness,
		});
	});

	// Sort by total games first (minimum engagement), then closeness
	return rivalries
		.sort((a, b) => {
			if (b.totalGames !== a.totalGames) {
				return b.totalGames - a.totalGames;
			}
			return b.closeness - a.closeness;
		})
		.slice(0, limit);
};
