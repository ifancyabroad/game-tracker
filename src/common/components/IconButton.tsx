import type { ButtonHTMLAttributes } from "react";

interface IIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon: React.ReactNode;
	variant?: "default" | "danger";
}

export const IconButton: React.FC<IIconButtonProps> = ({ icon, variant = "default", className = "", ...props }) => {
	const baseStyles =
		"rounded-lg p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1";

	const variantStyles = {
		default:
			"border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm hover:bg-[var(--color-hover)] hover:border-[var(--color-border-strong)] hover:shadow focus:ring-[var(--color-primary)]/30",
		danger: "border border-red-600/20 bg-red-600/10 text-red-500 shadow-sm hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-md focus:ring-red-500/50",
	};

	return (
		<button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
			<div className="h-4 w-4 [&>svg]:h-full [&>svg]:w-full">{icon}</div>
		</button>
	);
};
