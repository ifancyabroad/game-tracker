import { z } from "zod";

// ============================================
// Reusable Zod Schemas
// ============================================

export const playerSchema = z.object({
	firstName: z.string().min(1, "First name is required").max(30, "First name must be 30 characters or less").trim(),
	lastName: z.string().min(1, "Last name is required").max(30, "Last name must be 30 characters or less").trim(),
	preferredName: z
		.string()
		.max(30, "Preferred name must be 30 characters or less")
		.trim()
		.optional()
		.or(z.literal("")),
	color: z
		.string()
		.regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color (e.g., #6366f1)")
		.min(1, "Color is required"),
	pictureUrl: z
		.url("Picture URL must be a valid URL")
		.max(2048, "Picture URL is too long")
		.optional()
		.or(z.literal("")),
	showOnLeaderboard: z.boolean(),
});

export const gameSchema = z.object({
	name: z.string().min(1, "Game name is required").max(100, "Game name must be 100 characters or less").trim(),
	points: z.number().min(1, "Points must be at least 1").max(3, "Points must be at most 3"),
	type: z.enum(["board", "video"]), // Kept for backward compatibility
	tags: z.array(z.string()).default([]),
	color: z
		.string()
		.regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color (e.g., #6366f1)")
		.min(1, "Color is required"),
});

export const eventSchema = z.object({
	location: z.string().min(1, "Location is required").max(100, "Location must be 100 characters or less").trim(),
	date: z.string().min(1, "Date is required"),
	gameIds: z.array(z.string()).min(1, "At least one game must be selected"),
	playerIds: z.array(z.string()).min(1, "At least one player must be selected"),
	notes: z.string().max(1000, "Summary must be 1000 characters or less").trim().optional().or(z.literal("")),
});

export const playerResultSchema = z.object({
	playerId: z.string().min(1, "Player ID is required"),
	rank: z.number().nullable(),
	isWinner: z.boolean().nullable(),
	isLoser: z.boolean().nullable(),
});

export const resultSchema = z.object({
	eventId: z.string().min(1, "Event ID is required"),
	gameId: z.string().min(1, "Game ID is required"),
	order: z.number().min(1, "Order must be at least 1"),
	playerResults: z.array(playerResultSchema).min(1, "At least one player result is required"),
	notes: z.string().max(500, "Notes must be 500 characters or less").trim().optional().or(z.literal("")),
});

export const userSchema = z.object({
	email: z.email("Invalid email address").max(254, "Email is too long").toLowerCase().trim(),
	role: z.enum(["admin", "user"] as const),
	linkedPlayerId: z.string().nullable(),
});

export const brandingSettingsSchema = z.object({
	appName: z.string().min(1, "App name is required").max(50, "App name must be 50 characters or less"),
	logoUrl: z.string().nullable(),
});

export const themeSettingsSchema = z.object({
	themeName: z.string().min(1, "Please select a theme"),
});

// ============================================
// Type Inference from Schemas
// ============================================

export type PlayerFormData = z.infer<typeof playerSchema>;
export type GameFormData = z.infer<typeof gameSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
export type ResultFormData = z.infer<typeof resultSchema>;
export type PlayerResultFormData = z.infer<typeof playerResultSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type BrandingSettingsFormData = z.infer<typeof brandingSettingsSchema>;
export type ThemeSettingsFormData = z.infer<typeof themeSettingsSchema>;
