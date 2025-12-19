/**
 * Common calculation utilities for stats
 */

/**
 * Calculate win rate as a decimal (0-1)
 */
export function calculateWinRate(wins: number, games: number): number {
	return games > 0 ? wins / games : 0;
}

/**
 * Calculate win rate as a percentage (0-100), rounded to nearest integer
 */
export function calculateWinRatePercent(wins: number, games: number): number {
	return Math.round(calculateWinRate(wins, games) * 100);
}

/**
 * Calculate average value
 */
export function calculateAverage(total: number, count: number): number {
	return count > 0 ? total / count : 0;
}

/**
 * Calculate average and round to specified decimal places
 */
export function calculateAverageRounded(total: number, count: number, decimals = 1): number {
	const avg = calculateAverage(total, count);
	const factor = Math.pow(10, decimals);
	return Math.round(avg * factor) / factor;
}
