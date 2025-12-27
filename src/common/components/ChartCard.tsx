import { Card } from "./Card";

interface ChartCardProps {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children }) => {
	return (
		<Card variant="interactive" className="group p-3 sm:p-4">
			<div className="mb-3 sm:mb-4">
				<h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
				{subtitle && <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{subtitle}</p>}
			</div>
			<div className="h-[320px] w-full">{children}</div>
		</Card>
	);
};
