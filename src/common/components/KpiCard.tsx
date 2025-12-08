export const KpiCard: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({
	icon,
	label,
	value,
}) => {
	return (
		<div className="flex items-center gap-2.5 rounded-lg border border-gray-700 bg-black/20 px-2.5 py-2 shadow-sm transition-transform hover:-translate-y-0.5 sm:gap-3 sm:px-3">
			<div className="flex h-8 w-8 items-center justify-center rounded-md bg-black/20">{icon}</div>
			<div>
				<div className="text-xs text-gray-400">{label}</div>
				<div className="text-sm font-semibold text-white tabular-nums">{value}</div>
			</div>
		</div>
	);
};
