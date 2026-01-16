import React, { type ReactNode, type SelectHTMLAttributes } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	icon?: LucideIcon;
	label?: string;
	children: ReactNode;
}

export const Select: React.FC<SelectProps> = ({ icon: Icon, label, children, className = "", ...props }) => {
	return (
		<div>
			{label && <label className="mb-1 block text-xs text-[var(--color-text-secondary)]">{label}</label>}
			<div className="relative">
				{Icon && (
					<Icon className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />
				)}
				<select
					{...props}
					className={`w-full appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] ${Icon ? "pl-10" : "pl-3"} py-2 pr-10 text-sm text-[var(--color-text)] focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none disabled:opacity-60 ${className}`}
				>
					{children}
				</select>
				<ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />
			</div>
		</div>
	);
};
