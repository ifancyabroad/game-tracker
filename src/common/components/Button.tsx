import type { ButtonHTMLAttributes } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
}

export const Button: React.FC<IButtonProps> = ({
	children,
	className = "",
	variant = "primary",
	size = "md",
	fullWidth = false,
	...props
}) => {
	const baseStyles =
		"inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";

	const variantStyles = {
		primary:
			"bg-[var(--color-primary)] text-[var(--color-primary-contrast)] shadow-sm hover:opacity-90 hover:shadow-md focus:ring-[var(--color-primary)]/50",
		secondary:
			"bg-[var(--color-secondary)] text-[var(--color-secondary-contrast)] shadow-sm hover:opacity-90 hover:shadow-md focus:ring-[var(--color-secondary)]/50",
		ghost: "text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text)] focus:ring-[var(--color-border)]",
		danger: "bg-[var(--color-danger)] text-[var(--color-danger-contrast)] shadow-sm hover:opacity-90 hover:shadow-md focus:ring-[var(--color-danger)]/50",
	};

	const sizeStyles = {
		sm: "px-2 py-1 text-xs",
		md: "px-4 py-2 text-sm",
		lg: "px-6 py-3 text-base",
	};

	const widthStyles = fullWidth ? "w-full" : "";

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};
