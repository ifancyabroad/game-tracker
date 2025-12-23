/**
 * Stats calculation thresholds
 */
export const STATS_THRESHOLDS = {
	/** Minimum games required to qualify for "best game" stats */
	MIN_GAMES_FOR_BEST_GAME: 3,
	/** Minimum games required to appear on leaderboard */
	MIN_GAMES_FOR_LEADERBOARD: 1,
	/** Minimum games required for win rate calculations */
	MIN_GAMES_FOR_WIN_RATE: 3,
	/** Number of recent games to show in "recent form" charts */
	RECENT_GAMES_WINDOW: 20,
	/** Maximum number of top opponents to display */
	TOP_OPPONENTS_LIMIT: 5,
	/** Maximum number of most played games to display */
	MOST_PLAYED_GAMES_LIMIT: 8,
} as const;
