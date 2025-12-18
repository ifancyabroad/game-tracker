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
			<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/30">{icon}</div>
			<div className="min-w-0">
				<p className="text-xs text-gray-400">{title}</p>
				<p className="text-xl leading-tight font-semibold text-white">{value}</p>
				{hint ? <p className="text-[11px] text-gray-400">{hint}</p> : null}
			</div>
		</Card>
	);
};
