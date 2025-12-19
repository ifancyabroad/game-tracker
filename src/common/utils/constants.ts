/**
 * Application-wide constants
 */

/**
 * Default color values
 */
export const DEFAULT_COLOR = "#6366f1";
export const DEFAULT_GAME_COLOR = "#6366f1";

/**
 * Stats calculation thresholds
 */
export const STATS_THRESHOLDS = {
	/** Minimum games required to qualify for "best game" stats */
	MIN_GAMES_FOR_BEST_GAME: 3,
	/** Minimum games required to appear on leaderboard */
	MIN_GAMES_FOR_LEADERBOARD: 10,
	/** Minimum games required for win rate calculations */
	MIN_GAMES_FOR_WIN_RATE: 3,
	/** Number of recent games to show in "recent form" charts */
	RECENT_GAMES_WINDOW: 20,
	/** Maximum number of top opponents to display */
	TOP_OPPONENTS_LIMIT: 5,
	/** Maximum number of most played games to display */
	MOST_PLAYED_GAMES_LIMIT: 8,
} as const;

/**
 * Chart dimensions
 */
export const CHART_DEFAULTS = {
	/** Standard chart height in pixels */
	HEIGHT: 320,
} as const;

/**
 * Avatar sizes in pixels
 */
export const AVATAR_SIZES = {
	SMALL: 24,
	MEDIUM: 32,
	DEFAULT: 48,
	LARGE: 64,
} as const;
