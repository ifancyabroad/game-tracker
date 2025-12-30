import { Card } from "./Card";

export const HighlightCard: React.FC<{
	title: string;
	icon: React.ReactNode;
	lines: { k: string; v: string }[];
}> = ({ title, icon, lines }) => {
	return (
		<Card variant="interactive" className="p-3 sm:p-4">
			<div className="mb-2 flex items-center gap-2">
				<div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-accent)]">
					{icon}
				</div>
				<h3 className="text-sm font-bold text-[var(--color-text)] md:text-base">{title}</h3>
			</div>
			<dl className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
				{lines.map((row, i) => (
					<div key={i} className="col-span-3 flex justify-between gap-3 sm:col-span-2">
						<dt className="truncate text-[var(--color-text-secondary)]">{row.k}</dt>
						<dd className="truncate text-[var(--color-text)]">{row.v}</dd>
					</div>
				))}
			</dl>
		</Card>
	);
};
