export function getRoleLabel(role: "admin" | "user"): string {
	return role === "admin" ? "Admin" : "User";
}

export function getRoleBadgeVariant(role: "admin" | "user"): "primary" | "default" {
	return role === "admin" ? "primary" : "default";
}
