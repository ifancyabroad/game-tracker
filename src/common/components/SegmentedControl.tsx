import type { LucideIcon } from "lucide-react";

export interface SegmentedControlOption<T extends string> {
	value: T;
	label: string;
	icon: LucideIcon;
}

interface SegmentedControlProps<T extends string> {
	value: T;
	onChange: (value: T) => void;
	options: SegmentedControlOption<T>[];
	hideLabelsOnMobile?: boolean;
}

export const SegmentedControl = <T extends string>({
	value,
	onChange,
	options,
	hideLabelsOnMobile = false,
}: SegmentedControlProps<T>) => {
	return (
		<div className="flex gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)] p-1">
			{options.map((option) => {
				const Icon = option.icon;
				const isActive = value === option.value;

				return (
					<button
						key={option.value}
						onClick={() => onChange(option.value)}
						className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
							isActive
								? "bg-[var(--color-primary)] text-[var(--color-primary-contrast)]"
								: "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
						}`}
						aria-pressed={isActive}
						aria-label={option.label}
					>
						<Icon className="h-4 w-4" />
						<span className={hideLabelsOnMobile ? "hidden sm:inline" : ""}>{option.label}</span>
					</button>
				);
			})}
		</div>
	);
};
