export const formatPct = (n: number) => `${Math.round(n * 100)}%`;

export const pluralize = (n: number, one: string, many?: string) => (n === 1 ? one : (many ?? `${one}s`));

export const createMapById = <T extends { id: string }>(items: T[]): Map<string, T> => {
	const map = new Map<string, T>();
	for (const item of items) map.set(item.id, item);
	return map;
};
