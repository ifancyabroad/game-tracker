import { APP_DEFAULTS } from "./constants";

export interface ThemeColors {
	primary: string;
	primaryContrast: string;
	secondary: string;
	secondaryContrast: string;
	bg: string;
	surface: string;
	text: string;
	textSecondary: string;
	textMuted: string;
	border: string;
	borderStrong: string;
	hover: string;
	accent: string;
	// Semantic colors
	success: string;
	successContrast: string;
	danger: string;
	dangerContrast: string;
	warning: string;
	warningContrast: string;
	info: string;
	infoContrast: string;
	gold: string;
	goldContrast: string;
	silver: string;
	silverContrast: string;
	bronze: string;
	bronzeContrast: string;
}

export interface Theme {
	name: string;
	label: string;
	description: string;
	colors: ThemeColors;
}

export const THEMES: Record<string, Theme> = {
	"game-table": {
		name: "game-table",
		label: "Game Table",
		description: "Warm beige and brown tones reminiscent of a wooden game table",
		colors: {
			primary: "#92400e",
			primaryContrast: "#fef3c7",
			secondary: "#ea580c",
			secondaryContrast: "#ffffff",
			bg: "#e7dac8",
			surface: "#f5ede0",
			text: "#3c2a1a",
			textSecondary: "#5a4432",
			textMuted: "#78614f",
			border: "#cfc1ad",
			borderStrong: "#b5a189",
			hover: "#ebe2d1",
			accent: "#d4c5ae",
			success: "#16a34a",
			successContrast: "#ffffff",
			danger: "#b91c1c",
			dangerContrast: "#ffffff",
			warning: "#c2410c",
			warningContrast: "#ffffff",
			info: "#0369a1",
			infoContrast: "#ffffff",
			gold: "#fbbf24",
			goldContrast: "#1c1917",
			silver: "#94a3b8",
			silverContrast: "#1e293b",
			bronze: "#d97706",
			bronzeContrast: "#ffffff",
		},
	},
	"warm-charcoal": {
		name: "warm-charcoal",
		label: "Warm Charcoal",
		description: "Dark and cozy theme with warm orange and yellow accents",
		colors: {
			primary: "#fb923c",
			primaryContrast: "#1a1512",
			secondary: "#fbbf24",
			secondaryContrast: "#1a1512",
			bg: "#1a1512",
			surface: "#231f1a",
			text: "#f5f1ed",
			textSecondary: "#c4bbb0",
			textMuted: "#8a817a",
			border: "#352f28",
			borderStrong: "#4a4239",
			hover: "#2b2620",
			accent: "#1e1a16",
			success: "#34d399",
			successContrast: "#1a1512",
			danger: "#f87171",
			dangerContrast: "#1a1512",
			warning: "#fbbf24",
			warningContrast: "#1a1512",
			info: "#38bdf8",
			infoContrast: "#1a1512",
			gold: "#fbbf24",
			goldContrast: "#1a1512",
			silver: "#cbd5e1",
			silverContrast: "#1e293b",
			bronze: "#fb923c",
			bronzeContrast: "#1a1512",
		},
	},
	"cool-slate": {
		name: "cool-slate",
		label: "Cool Slate",
		description: "Clean and modern light theme with cool gray tones",
		colors: {
			primary: "#475569",
			primaryContrast: "#f1f5f9",
			secondary: "#0ea5e9",
			secondaryContrast: "#ffffff",
			bg: "#f1f5f9",
			surface: "#ffffff",
			text: "#0f172a",
			textSecondary: "#334155",
			textMuted: "#64748b",
			border: "#e2e8f0",
			borderStrong: "#cbd5e1",
			hover: "#f8fafc",
			accent: "#e7eef5",
			success: "#16a34a",
			successContrast: "#ffffff",
			danger: "#dc2626",
			dangerContrast: "#ffffff",
			warning: "#ea580c",
			warningContrast: "#ffffff",
			info: "#0284c7",
			infoContrast: "#ffffff",
			gold: "#fbbf24",
			goldContrast: "#1c1917",
			silver: "#94a3b8",
			silverContrast: "#1e293b",
			bronze: "#d97706",
			bronzeContrast: "#ffffff",
		},
	},
	"midnight-blue": {
		name: "midnight-blue",
		label: "Midnight Blue",
		description: "Professional dark theme with deep blue tones",
		colors: {
			primary: "#60a5fa",
			primaryContrast: "#172554",
			secondary: "#38bdf8",
			secondaryContrast: "#172554",
			bg: "#0f172a",
			surface: "#1e293b",
			text: "#f1f5f9",
			textSecondary: "#cbd5e1",
			textMuted: "#94a3b8",
			border: "#334155",
			borderStrong: "#475569",
			hover: "#1e293b",
			accent: "#0f1729",
			success: "#34d399",
			successContrast: "#0f172a",
			danger: "#f87171",
			dangerContrast: "#0f172a",
			warning: "#fbbf24",
			warningContrast: "#0f172a",
			info: "#38bdf8",
			infoContrast: "#0f172a",
			gold: "#fbbf24",
			goldContrast: "#0f172a",
			silver: "#cbd5e1",
			silverContrast: "#1e293b",
			bronze: "#fb923c",
			bronzeContrast: "#0f172a",
		},
	},
	"forest-green": {
		name: "forest-green",
		label: "Forest Green",
		description: "Natural light theme with soft green and earth tones",
		colors: {
			primary: "#16a34a",
			primaryContrast: "#f0fdf4",
			secondary: "#84cc16",
			secondaryContrast: "#ffffff",
			bg: "#f0fdf4",
			surface: "#ffffff",
			text: "#14532d",
			textSecondary: "#166534",
			textMuted: "#22c55e",
			border: "#dcfce7",
			borderStrong: "#bbf7d0",
			hover: "#f7fef9",
			accent: "#e8f9ee",
			success: "#22c55e",
			successContrast: "#ffffff",
			danger: "#dc2626",
			dangerContrast: "#ffffff",
			warning: "#ea580c",
			warningContrast: "#ffffff",
			info: "#0284c7",
			infoContrast: "#ffffff",
			gold: "#fbbf24",
			goldContrast: "#1c1917",
			silver: "#94a3b8",
			silverContrast: "#1e293b",
			bronze: "#d97706",
			bronzeContrast: "#ffffff",
		},
	},
	"soft-lavender": {
		name: "soft-lavender",
		label: "Soft Lavender",
		description: "Gentle light theme with purple and pink accents",
		colors: {
			primary: "#7c3aed",
			primaryContrast: "#faf5ff",
			secondary: "#ec4899",
			secondaryContrast: "#ffffff",
			bg: "#faf5ff",
			surface: "#ffffff",
			text: "#3b0764",
			textSecondary: "#581c87",
			textMuted: "#7c3aed",
			border: "#e9d5ff",
			borderStrong: "#d8b4fe",
			hover: "#fdf9ff",
			accent: "#f3ebff",
			success: "#16a34a",
			successContrast: "#ffffff",
			danger: "#dc2626",
			dangerContrast: "#ffffff",
			warning: "#ea580c",
			warningContrast: "#ffffff",
			info: "#0284c7",
			infoContrast: "#ffffff",
			gold: "#fbbf24",
			goldContrast: "#1c1917",
			silver: "#94a3b8",
			silverContrast: "#1e293b",
			bronze: "#d97706",
			bronzeContrast: "#ffffff",
		},
	},
};

export function getThemeByName(name: string): Theme {
	return THEMES[name] || THEMES[APP_DEFAULTS.THEME_NAME];
}

export function applyThemeColors(themeName: string): void {
	const theme = getThemeByName(themeName);
	const root = document.documentElement;

	Object.entries(theme.colors).forEach(([key, value]) => {
		// Convert camelCase to kebab-case (e.g., primaryContrast -> primary-contrast)
		const cssVar = key.replace(/([A-Z])/g, "-$1").toLowerCase();
		root.style.setProperty(`--color-${cssVar}`, value);
	});
}
