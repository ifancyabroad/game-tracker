import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
	icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
	({ className = "", error = false, icon, ...props }, ref) => {
		const baseStyles =
			"w-full rounded-lg border border-gray-700 bg-black/20 px-3 py-2 text-sm text-[var(--color-text)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent";
		const errorStyles = error ? "ring-2 ring-red-500" : "";
		const iconStyles = icon ? "pr-9 [&::-webkit-calendar-picker-indicator]:hidden" : "";

		return (
			<div className="relative w-full">
				<input ref={ref} className={`${baseStyles} ${errorStyles} ${iconStyles} ${className}`} {...props} />
				{icon && (
					<div className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--color-primary)] [&>svg]:h-full [&>svg]:w-full">
						{icon}
					</div>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";
