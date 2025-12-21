interface IFormHeaderProps {
	icon: React.ReactNode;
	title: string;
}

export const FormHeader: React.FC<IFormHeaderProps> = ({ icon, title }) => {
	return (
		<div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
			<div className="h-4 w-4 text-[var(--color-primary)] [&>svg]:h-full [&>svg]:w-full">{icon}</div>
			<h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
		</div>
	);
};
