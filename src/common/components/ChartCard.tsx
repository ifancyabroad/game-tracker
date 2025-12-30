import { SearchX } from "lucide-react";
import { Card } from "./Card";

interface ChartCardProps {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
	isEmpty?: boolean;
	emptyTitle?: string;
	emptyDescription?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
	title,
	subtitle,
	children,
	isEmpty = false,
	emptyTitle,
	emptyDescription,
}) => {
	return (
		<Card variant="interactive" className="group p-3 sm:p-4">
			<div className="mb-3 sm:mb-4">
				<h3 className="text-sm font-bold text-[var(--color-text)] md:text-base">{title}</h3>
				{subtitle && <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{subtitle}</p>}
			</div>
			<div className="h-[320px] w-full">
				{isEmpty ? (
					<div className="flex h-full w-full flex-col items-center justify-center text-center text-sm text-[var(--color-text-secondary)]">
						<SearchX size={32} className="mb-2 text-[var(--color-text-secondary)]" />
						{emptyTitle && <p>{emptyTitle}</p>}
						{emptyDescription && <p className="text-xs">{emptyDescription}</p>}
					</div>
				) : (
					children
				)}
			</div>
		</Card>
	);
};
