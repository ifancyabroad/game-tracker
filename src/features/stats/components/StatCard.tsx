import { type ReactNode } from "react";

interface StatCardProps {
	icon: ReactNode;
	title: string;
	value: number | string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => {
	return (
		<div className="flex items-center gap-4 rounded-xl border border-gray-700 bg-[var(--color-surface)] p-4 shadow-sm">
			<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-primary-contrast)]">
				{icon}
			</div>
			<div className="flex flex-col">
				<span className="text-sm text-gray-400">{title}</span>
				<span className="text-xl font-semibold text-[var(--color-primary)]">{value}</span>
			</div>
		</div>
	);
};
