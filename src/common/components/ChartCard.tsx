import { Card } from "./Card";

interface ChartCardProps {
	title: string;
	children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
	return (
		<Card variant="interactive" className="group p-3 sm:p-4">
			<h3 className="mb-3 text-sm font-semibold text-white sm:mb-4">{title}</h3>
			<div className="h-[320px] w-full">{children}</div>
		</Card>
	);
};
