import type { PlayerWithData } from "features/players/types";
import { STATS_THRESHOLDS } from "common/utils/constants";
import { sortLeaderboard } from "common/utils/sorting";

/**
 * Filter and sort players to create leaderboard
 * Only includes players with minimum required games
 */
export function getLeaderboard(players: PlayerWithData[]): PlayerWithData[] {
	const playersWithGames = players.filter(
		(player) => player.data.games >= STATS_THRESHOLDS.MIN_GAMES_FOR_LEADERBOARD,
	);
	return sortLeaderboard(playersWithGames);
}
