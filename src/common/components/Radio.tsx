import type { InputHTMLAttributes } from "react";

interface IRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
	label: string;
}

export const Radio: React.FC<IRadioProps> = ({ label, className = "", ...props }) => {
	return (
		<label className={`group flex cursor-pointer items-center gap-2 text-sm text-gray-300 ${className}`}>
			<div className="relative flex h-4 w-4 items-center justify-center">
				<input type="radio" className="peer sr-only" {...props} />
				<div className="h-4 w-4 rounded-full border-2 border-gray-600 bg-black/20 transition-all group-hover:border-gray-500 peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]/20"></div>
				<div className="absolute h-2 w-2 rounded-full bg-[var(--color-primary)] opacity-0 transition-opacity peer-checked:opacity-100"></div>
			</div>
			{label}
		</label>
	);
};
