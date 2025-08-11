import { type ReactNode } from "react";

interface StatCardProps {
	icon: ReactNode;
	title: string;
	value: number | string;
	hint?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, value, hint }) => {
	return (
		<div className="group relative flex items-center gap-4 rounded-xl border border-gray-700 bg-[var(--color-surface)] p-4 shadow-sm transition-transform hover:-translate-y-0.5">
			<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/30">{icon}</div>
			<div className="min-w-0">
				<p className="text-xs text-gray-400">{title}</p>
				<p className="text-xl leading-tight font-semibold text-white">{value}</p>
				{hint ? <p className="text-[11px] text-gray-400">{hint}</p> : null}
			</div>
		</div>
	);
};
