import type { ButtonHTMLAttributes } from "react";

interface IIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon: React.ReactNode;
	variant?: "default" | "danger";
}

export const IconButton: React.FC<IIconButtonProps> = ({ icon, variant = "default", className = "", ...props }) => {
	const variantStyles = {
		default: "text-[var(--color-text)] hover:bg-[var(--color-hover)]",
		danger: "text-red-300 hover:bg-red-500/20",
	};

	return (
		<button
			className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)] p-2 transition-colors ${variantStyles[variant]} ${className}`}
			{...props}
		>
			<div className="h-4 w-4 [&>svg]:h-full [&>svg]:w-full">{icon}</div>
		</button>
	);
};
