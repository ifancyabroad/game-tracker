import type { HTMLAttributes } from "react";

interface ICardProps extends HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "interactive" | "empty";
}

export const Card: React.FC<ICardProps> = ({ children, className = "", variant = "default", ...props }) => {
	const baseStyles = "rounded-xl border border-gray-700 bg-[var(--color-surface)]";

	const variantStyles = {
		default: "shadow-sm",
		interactive: "shadow-sm transition-transform hover:-translate-y-0.5",
		empty: "",
	};

	return (
		<div className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
			{children}
		</div>
	);
};
