import { Card } from "./Card";

interface IEmptyStateProps {
	children: React.ReactNode;
	className?: string;
}

export const EmptyState: React.FC<IEmptyStateProps> = ({ children, className = "" }) => {
	return (
		<Card className={`p-6 text-center text-sm text-[var(--color-text-secondary)] ${className}`}>{children}</Card>
	);
};
