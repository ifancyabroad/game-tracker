export const formatPct = (n: number) => `${Math.round(n * 100)}%`;

export const pluralize = (n: number, one: string, many?: string) => (n === 1 ? one : (many ?? `${one}s`));
