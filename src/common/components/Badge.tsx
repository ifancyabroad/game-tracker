interface IBadgeProps {
	children: React.ReactNode;
	variant?: "default" | "primary" | "success" | "info" | "warning" | "danger";
	className?: string;
}

export const Badge: React.FC<IBadgeProps> = ({ children, variant = "default", className = "" }) => {
	const baseStyles = "inline-flex items-center rounded-full px-2 py-0.5 text-xs";

	const variantStyles = {
		default: "border border-[var(--color-border)] text-[var(--color-text-secondary)]",
		primary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
		success: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
		info: "bg-[var(--color-info)]/10 text-[var(--color-info)]",
		warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
		danger: "bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
	};

	return <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>{children}</span>;
};
