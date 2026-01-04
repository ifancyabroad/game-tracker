import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface IInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	error?: boolean;
	icon?: React.ReactNode;
	inputSize?: "sm" | "md" | "lg";
	fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
	({ className = "", error = false, icon, inputSize = "md", fullWidth = true, ...props }, ref) => {
		const sizeStyles = {
			sm: "px-2 py-1",
			md: "px-3 py-2",
			lg: "px-4 py-3",
		};

		const baseStyles = `rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)] ${sizeStyles[inputSize]} text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent`;
		const widthStyles = fullWidth ? "w-full" : "";
		const errorStyles = error ? "ring-2 ring-[var(--color-danger)]" : "";
		const iconStyles = icon ? "pr-9 [&::-webkit-calendar-picker-indicator]:hidden" : "";

		return (
			<div className="relative">
				<input
					ref={ref}
					className={`${baseStyles} ${widthStyles} ${errorStyles} ${iconStyles} ${className}`}
					{...props}
				/>
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
