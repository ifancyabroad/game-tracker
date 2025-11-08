import type { IPlayer } from "features/players/types";

export function getFullName(p?: IPlayer) {
	if (!p) return "Unknown";
	return `${p.firstName} ${p.lastName}`.trim();
}

export function getDisplayName(p?: IPlayer) {
	if (!p) return "Unknown";
	return p.preferredName?.trim() || p.firstName?.trim();
}

export function getInitials(p?: IPlayer) {
	if (!p) return "?";
	const a = (p.preferredName || p.firstName || "").trim()[0] ?? "";
	const b = (p.lastName || "").trim()[0] ?? "";
	return (a + b).toUpperCase() || "?";
}
