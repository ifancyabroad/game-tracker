import type { InputHTMLAttributes } from "react";

interface IRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
	label: string;
}

export const Radio: React.FC<IRadioProps> = ({ label, className = "", ...props }) => {
	return (
		<label className={`group flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text)] ${className}`}>
			<div className="relative flex h-4 w-4 items-center justify-center">
				<input type="radio" className="peer sr-only" {...props} />
				<div className="h-4 w-4 rounded-full border-2 border-[var(--color-border-strong)] bg-[var(--color-accent)] transition-all group-hover:border-[var(--color-text-secondary)] peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]/20"></div>
				<div className="absolute h-2 w-2 rounded-full bg-[var(--color-primary)] opacity-0 transition-opacity peer-checked:opacity-100"></div>
			</div>
			{label}
		</label>
	);
};
