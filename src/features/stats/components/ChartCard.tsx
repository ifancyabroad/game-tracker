interface ChartCardProps {
	title: string;
	children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
	return (
		<div className="rounded-xl border border-gray-700 bg-[var(--color-surface)] p-4 shadow-sm">
			<h3 className="text-md mb-4 font-semibold text-[var(--color-primary)]">{title}</h3>
			<div className="h-[300px] w-full">{children}</div>
		</div>
	);
};
