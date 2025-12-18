import type { ButtonHTMLAttributes } from "react";

interface IChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	active?: boolean;
	icon?: React.ReactNode;
	label: string;
	maxWidth?: string;
}

export const Chip: React.FC<IChipProps> = ({
	active = false,
	icon,
	label,
	maxWidth = "10rem",
	className = "",
	...props
}) => {
	const baseStyles = "inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs transition-colors";
	const activeStyles = active
		? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
		: "border-gray-700 bg-black/20 text-gray-300 hover:border-[var(--color-primary)]/40 hover:bg-white/5";

	return (
		<button type="button" className={`${baseStyles} ${activeStyles} ${className}`} {...props}>
			{icon && <div className="h-3.5 w-3.5 [&>svg]:h-full [&>svg]:w-full">{icon}</div>}
			<span className="truncate" style={{ maxWidth }}>
				{label}
			</span>
		</button>
	);
};
