import type { ButtonHTMLAttributes } from "react";

interface IIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon: React.ReactNode;
	variant?: "primary" | "secondary" | "ghost" | "danger" | "warning" | "info";
}

export const IconButton: React.FC<IIconButtonProps> = ({ icon, variant = "ghost", className = "", ...props }) => {
	const baseStyles =
		"rounded-lg p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1";

	const variantStyles = {
		primary:
			"bg-[var(--color-primary)] text-[var(--color-primary-contrast)] shadow-sm hover:opacity-90 hover:shadow-md focus:ring-[var(--color-primary)]/50",
		secondary:
			"bg-[var(--color-secondary)] text-[var(--color-secondary-contrast)] shadow-sm hover:opacity-90 hover:shadow-md focus:ring-[var(--color-secondary)]/50",
		ghost: "text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text)] focus:ring-[var(--color-border)]",
		danger: "bg-[var(--color-danger)] text-[var(--color-danger-contrast)] shadow-sm hover:opacity-90 hover:shadow-md focus:ring-[var(--color-danger)]/50",
		warning:
			"bg-[var(--color-warning)] text-[var(--color-warning-contrast)] shadow-sm hover:opacity-90 hover:shadow-md focus:ring-[var(--color-warning)]/50",
		info: "bg-[var(--color-info)] text-[var(--color-info-contrast)] shadow-sm hover:opacity-90 hover:shadow-md focus:ring-[var(--color-info)]/50",
	};

	return (
		<button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
			<div className="h-4 w-4 [&>svg]:h-full [&>svg]:w-full">{icon}</div>
		</button>
	);
};
