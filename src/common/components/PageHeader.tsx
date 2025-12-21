interface IPageHeaderProps {
	icon: React.ReactNode;
	title: string;
	count?: number;
	action?: React.ReactNode;
}

export const PageHeader: React.FC<IPageHeaderProps> = ({ icon, title, count, action }) => {
	return (
		<div className="mb-3 flex items-center justify-between gap-4 sm:mb-4">
			<div className="flex items-center gap-2 text-[var(--color-text)]">
				<div className="h-5 w-5 text-[var(--color-primary)] [&>svg]:h-full [&>svg]:w-full">{icon}</div>
				<h1 className="text-base font-semibold">{title}</h1>
				{count !== undefined && (
					<span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-text-secondary)]">
						{count}
					</span>
				)}
			</div>
			{action}
		</div>
	);
};
