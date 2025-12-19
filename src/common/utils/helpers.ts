export const formatPct = (n: number) => `${Math.round(n * 100)}%`;

export const pluralize = (n: number, one: string, many?: string) => (n === 1 ? one : (many ?? `${one}s`));

export const createMapBy = <T, K extends keyof T>(items: T[], key: K): Map<T[K], T> => {
	const map = new Map<T[K], T>();
	for (const item of items) {
		map.set(item[key], item);
	}
	return map;
};
