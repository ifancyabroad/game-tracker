import type { ButtonHTMLAttributes } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost";
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
	const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-opacity";

	const variantStyles = {
		primary: "bg-[var(--color-primary)] text-[var(--color-primary-contrast)] hover:opacity-90 disabled:opacity-50",
		secondary:
			"border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm hover:bg-[var(--color-primary)]/10",
		ghost: "text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)]",
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
