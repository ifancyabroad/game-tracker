import { type ReactNode } from "react";
import { Card } from "common/components";

interface StatCardProps {
	icon: ReactNode;
	title: string;
	value: number | string;
	hint?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, value, hint }) => {
	return (
		<Card variant="interactive" className="group relative flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
			<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]">{icon}</div>
			<div className="min-w-0">
				<p className="text-xs text-[var(--color-text-secondary)]">{title}</p>
				<p className="text-xl leading-tight font-semibold text-[var(--color-text)]">{value}</p>
				{hint ? <p className="text-[11px] text-[var(--color-text-secondary)]">{hint}</p> : null}
			</div>
		</Card>
	);
};
