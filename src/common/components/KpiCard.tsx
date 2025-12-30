export const KpiCard: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({
	icon,
	label,
	value,
}) => {
	return (
		<div className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-2 shadow-sm transition-transform hover:-translate-y-0.5 sm:gap-3 sm:px-3">
			<div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-accent)]">{icon}</div>
			<div className="overflow-hidden">
				<div className="text-xs text-[var(--color-text-secondary)]">{label}</div>
				<div className="truncate text-base font-bold text-[var(--color-text)] tabular-nums md:text-lg">
					{value}
				</div>
			</div>
		</div>
	);
};
