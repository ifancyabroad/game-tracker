export interface IUser {
	id: string; // Firebase Auth UID
	email: string;
	role: "admin" | "user";
	linkedPlayerId: string | null;
	createdAt: string;
}

export type UserRole = "admin" | "user";
