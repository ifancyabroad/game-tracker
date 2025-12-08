interface ChartCardProps {
	title: string;
	children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
	return (
		<div className="group rounded-xl border border-gray-700 bg-[var(--color-surface)] p-3 shadow-sm transition-transform hover:-translate-y-0.5 sm:p-4">
			<h3 className="mb-3 text-sm font-semibold text-white sm:mb-4">{title}</h3>
			<div className="h-[320px] w-full">{children}</div>
		</div>
	);
};
