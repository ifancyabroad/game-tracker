import { z } from "zod";

// ============================================
// Reusable Zod Schemas
// ============================================

export const playerSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	preferredName: z.string().optional(),
	color: z.string().min(1, "Color is required"),
	pictureUrl: z.string().optional(),
	showOnLeaderboard: z.boolean(),
});

export const gameSchema = z.object({
	name: z.string().min(1, "Game name is required"),
	points: z.number().min(1, "Points must be at least 1").max(3, "Points must be at most 3"),
	type: z.enum(["board", "video"]),
	color: z.string().min(1, "Color is required"),
});

export const eventSchema = z.object({
	location: z.string().min(1, "Location is required"),
	date: z.string().min(1, "Date is required"),
	gameIds: z.array(z.string()).min(1, "At least one game must be selected"),
	playerIds: z.array(z.string()).min(1, "At least one player must be selected"),
	notes: z.string().max(1000, "Summary must be 1000 characters or less").optional(),
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
	notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
});

export const userSchema = z.object({
	email: z.email(),
	role: z.enum(["admin", "user"] as const),
	linkedPlayerId: z.string().nullable(),
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
