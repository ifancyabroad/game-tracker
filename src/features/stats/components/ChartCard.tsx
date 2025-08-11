interface ChartCardProps {
	title: string;
	children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
	return (
		<div className="group rounded-xl border border-gray-700 bg-[var(--color-surface)] p-4 shadow-sm transition-transform hover:-translate-y-0.5">
			<h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
			<div className="h-[320px] w-full">{children}</div>
		</div>
	);
};
