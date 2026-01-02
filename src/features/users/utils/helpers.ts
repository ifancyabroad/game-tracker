export function getRoleLabel(role: "admin" | "user"): string {
	return role === "admin" ? "Admin" : "User";
}

export function getRoleBadgeColor(role: "admin" | "user"): string {
	return role === "admin" ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500";
}
