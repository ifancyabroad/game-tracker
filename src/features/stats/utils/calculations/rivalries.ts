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

interface PlayerStatus {
	playerId: string;
	isWinner: boolean;
}

interface PairStats {
	player1Id: string;
	player2Id: string;
	player1Wins: number;
	player2Wins: number;
	totalGames: number;
}

/**
 * Get player statuses (ID and winner status) from a result
 */
function getPlayerStatuses(result: IResult): PlayerStatus[] {
	return result.playerResults.map((pr) => ({
		playerId: pr.playerId,
		isWinner: isPlayerWinner(pr),
	}));
}

/**
 * Create a consistent pair key from two player IDs
 */
function createPairKey(playerId1: string, playerId2: string): string {
	return [playerId1, playerId2].sort().join("-");
}

/**
 * Initialize pair stats if not exists
 */
function initializePairStats(
	pairStats: Map<string, PairStats>,
	pairKey: string,
	player1Id: string,
	player2Id: string,
): void {
	if (!pairStats.has(pairKey)) {
		pairStats.set(pairKey, {
			player1Id,
			player2Id,
			player1Wins: 0,
			player2Wins: 0,
			totalGames: 0,
		});
	}
}

/**
 * Update pair stats based on game outcome
 */
function updatePairStats(stats: PairStats, player1: PlayerStatus, player2: PlayerStatus): void {
	stats.totalGames++;

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

/**
 * Process all results to build pair statistics
 */
function buildPairStatistics(results: IResult[]): Map<string, PairStats> {
	const pairStats = new Map<string, PairStats>();

	results.forEach((result) => {
		const playerStatuses = getPlayerStatuses(result);

		// For each unique pair in this game
		for (let i = 0; i < playerStatuses.length; i++) {
			for (let j = i + 1; j < playerStatuses.length; j++) {
				const player1 = playerStatuses[i];
				const player2 = playerStatuses[j];
				const pairKey = createPairKey(player1.playerId, player2.playerId);

				initializePairStats(pairStats, pairKey, player1.playerId, player2.playerId);
				const stats = pairStats.get(pairKey)!;
				updatePairStats(stats, player1, player2);
			}
		}
	});

	return pairStats;
}

/**
 * Get display name for a player
 */
function getPlayerDisplayName(player: IPlayer): string {
	return player.preferredName || player.firstName;
}

/**
 * Calculate closeness metric (100 = perfectly even, 0 = one player dominates)
 */
function calculateCloseness(player1Wins: number, player2Wins: number, totalGames: number): number {
	const winDiff = Math.abs(player1Wins - player2Wins);
	return Math.max(0, 100 - (winDiff / totalGames) * 100);
}

/**
 * Convert pair stats to rivalry object
 */
function createRivalry(
	stats: PairStats,
	player1: IPlayer,
	player2: IPlayer,
	player1Wins: number,
	player2Wins: number,
): TopRivalry {
	const closeness = calculateCloseness(player1Wins, player2Wins, stats.totalGames);

	return {
		player1Id: stats.player1Id,
		player1Name: getPlayerDisplayName(player1),
		player1Color: player1.color,
		player1PictureUrl: player1.pictureUrl || undefined,
		player2Id: stats.player2Id,
		player2Name: getPlayerDisplayName(player2),
		player2Color: player2.color,
		player2PictureUrl: player2.pictureUrl || undefined,
		totalGames: stats.totalGames,
		player1Wins,
		player2Wins,
		closeness,
	};
}

/**
 * Convert pair stats to rivalry with dominant player first
 */
function createLopsidedRivalry(stats: PairStats, player1: IPlayer, player2: IPlayer): TopRivalry {
	const p1Wins = stats.player1Wins;
	const p2Wins = stats.player2Wins;
	const isDominant = p1Wins > p2Wins;

	const closeness = calculateCloseness(p1Wins, p2Wins, stats.totalGames);

	return {
		player1Id: isDominant ? stats.player1Id : stats.player2Id,
		player1Name: getPlayerDisplayName(isDominant ? player1 : player2),
		player1Color: isDominant ? player1.color : player2.color,
		player1PictureUrl: (isDominant ? player1.pictureUrl : player2.pictureUrl) || undefined,
		player2Id: isDominant ? stats.player2Id : stats.player1Id,
		player2Name: getPlayerDisplayName(isDominant ? player2 : player1),
		player2Color: isDominant ? player2.color : player1.color,
		player2PictureUrl: (isDominant ? player2.pictureUrl : player1.pictureUrl) || undefined,
		totalGames: stats.totalGames,
		player1Wins: isDominant ? p1Wins : p2Wins,
		player2Wins: isDominant ? p2Wins : p1Wins,
		closeness,
	};
}

/**
 * Filter pair stats by minimum games threshold
 */
function filterByMinimumGames(
	pairStats: Map<string, PairStats>,
	playerById: Map<string, IPlayer>,
	minGames: number = 5,
): Array<{ stats: PairStats; player1: IPlayer; player2: IPlayer }> {
	const filtered: Array<{ stats: PairStats; player1: IPlayer; player2: IPlayer }> = [];

	pairStats.forEach((stats) => {
		const player1 = playerById.get(stats.player1Id);
		const player2 = playerById.get(stats.player2Id);

		// Require minimum games AND at least one player has a win (not all ties)
		if (player1 && player2 && stats.totalGames >= minGames && (stats.player1Wins > 0 || stats.player2Wins > 0)) {
			filtered.push({ stats, player1, player2 });
		}
	});

	return filtered;
}

/**
 * Build rivalry matrix for all players
 */
export const buildRivalryMatrix = (results: IResult[], playerById: Map<string, IPlayer>): RivalryData[] => {
	const rivalries = new Map<string, Map<string, { wins: number; losses: number; total: number }>>();

	results.forEach((result) => {
		const playerStatuses = getPlayerStatuses(result);

		// For each player pair in this game
		for (let i = 0; i < playerStatuses.length; i++) {
			const player1 = playerStatuses[i];

			if (!rivalries.has(player1.playerId)) {
				rivalries.set(player1.playerId, new Map());
			}
			const player1Rivalries = rivalries.get(player1.playerId)!;

			for (let j = 0; j < playerStatuses.length; j++) {
				if (i === j) continue;

				const player2 = playerStatuses[j];

				if (!player1Rivalries.has(player2.playerId)) {
					player1Rivalries.set(player2.playerId, { wins: 0, losses: 0, total: 0 });
				}

				const record = player1Rivalries.get(player2.playerId)!;
				record.total++;

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
			playerName: getPlayerDisplayName(player),
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
	const pairStats = buildPairStatistics(results);
	const validPairs = filterByMinimumGames(pairStats, playerById);

	const rivalries = validPairs.map(({ stats, player1, player2 }) =>
		createRivalry(stats, player1, player2, stats.player1Wins, stats.player2Wins),
	);

	// Sort by closeness (most competitive rivalries)
	return rivalries.sort((a, b) => b.closeness - a.closeness).slice(0, limit);
};

/**
 * Find the most lopsided rivalries (biggest win gap percentage)
 */
export const getLopsidedRivalries = (
	results: IResult[],
	playerById: Map<string, IPlayer>,
	limit: number = 5,
): TopRivalry[] => {
	const pairStats = buildPairStatistics(results);
	const validPairs = filterByMinimumGames(pairStats, playerById);

	const rivalries = validPairs.map(({ stats, player1, player2 }) => createLopsidedRivalry(stats, player1, player2));

	// Sort by biggest gap (lowest closeness)
	return rivalries.sort((a, b) => a.closeness - b.closeness).slice(0, limit);
};
