export type Theme = "light" | "dark";

/**
 * Get initial theme from localStorage or browser preference
 * @returns The initial theme to use
 */
export const getInitialTheme = (): Theme => {
	const stored = localStorage.getItem("theme");
	if (stored === "light" || stored === "dark") {
		return stored;
	}
	// Default to browser preference
	if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
		return "dark";
	}
	return "light";
};
