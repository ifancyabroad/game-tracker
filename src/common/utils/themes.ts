import { APP_DEFAULTS } from "./constants";

export interface ThemePreview {
	primary: string;
	bg: string;
	surface: string;
}

export interface Theme {
	name: string;
	label: string;
	description: string;
	preview: ThemePreview;
}

export const THEMES: Record<string, Theme> = {
	// Light Themes
	"game-table": {
		name: "game-table",
		label: "Game Table",
		description: "Warm beige and brown tones reminiscent of a wooden game table",
		preview: {
			primary: "#92400e",
			bg: "#e7dac8",
			surface: "#f5ede0",
		},
	},
	"autumn-vineyard": {
		name: "autumn-vineyard",
		label: "Autumn Vineyard",
		description: "Autumn theme with burgundy wine and golden fall tones",
		preview: {
			primary: "#9f1239",
			bg: "#f0ebe0",
			surface: "#faf7f0",
		},
	},
	"forest-moss": {
		name: "forest-moss",
		label: "Forest Moss",
		description: "Natural forest theme with earthy greens and browns",
		preview: {
			primary: "#15803d",
			bg: "#ddd8c8",
			surface: "#ebe8db",
		},
	},
	// Dark Themes
	"warm-charcoal": {
		name: "warm-charcoal",
		label: "Warm Charcoal",
		description: "Dark and cozy theme with warm orange and yellow accents",
		preview: {
			primary: "#fb923c",
			bg: "#1a1512",
			surface: "#231f1a",
		},
	},
	"midnight-blue": {
		name: "midnight-blue",
		label: "Midnight Blue",
		description: "Professional dark theme with deep blue tones",
		preview: {
			primary: "#60a5fa",
			bg: "#0f172a",
			surface: "#1e293b",
		},
	},
	"violet-night": {
		name: "violet-night",
		label: "Violet Night",
		description: "Elegant dark theme with violet accents on charcoal",
		preview: {
			primary: "#a78bfa",
			bg: "#18181b",
			surface: "#27272a",
		},
	},
};

export function getThemeByName(name: string): Theme {
	return THEMES[name] || THEMES[APP_DEFAULTS.THEME_NAME];
}

export function applyThemeColors(themeName: string): void {
	document.documentElement.dataset.theme = themeName;
}
