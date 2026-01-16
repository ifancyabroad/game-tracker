export const formatPct = (n: number) => `${Math.round(n * 100)}%`;

export const pluralize = (n: number, one: string, many?: string) => (n === 1 ? one : (many ?? `${one}s`));

export const createMapBy = <T, K extends keyof T>(items: T[], key: K): Map<T[K], T> => {
	const map = new Map<T[K], T>();
	for (const item of items) {
		map.set(item[key], item);
	}
	return map;
};

/**
 * Calculate win rate as a percentage (0-100), rounded to nearest integer
 * Used for displaying win percentages in UI components
 */
export const calculateWinRatePercent = (wins: number, games: number): number => {
	return games > 0 ? Math.round((wins / games) * 100) : 0;
};
