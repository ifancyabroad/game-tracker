interface IBadgeProps {
	children: React.ReactNode;
	variant?: "default" | "primary" | "success" | "warning" | "danger";
	className?: string;
}

export const Badge: React.FC<IBadgeProps> = ({ children, variant = "default", className = "" }) => {
	const baseStyles = "inline-flex items-center rounded-full px-2 py-0.5 text-xs";

	const variantStyles = {
		default: "border border-[var(--color-border)] text-[var(--color-text-secondary)]",
		primary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
		success: "bg-green-500/10 text-green-400",
		warning: "bg-yellow-500/10 text-yellow-400",
		danger: "bg-red-500/10 text-red-400",
	};

	return <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>{children}</span>;
};
