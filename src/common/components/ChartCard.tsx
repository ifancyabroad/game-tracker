import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";

interface ChartCardProps {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
	icon?: LucideIcon;
	iconColor?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children, icon: Icon, iconColor }) => {
	return (
		<Card variant="interactive" className="group p-3 sm:p-4">
			<div className="mb-3 sm:mb-4">
				<div className="flex items-center gap-2">
					{Icon && <Icon className="h-4 w-4" style={{ color: iconColor || "var(--color-primary)" }} />}
					<h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
				</div>
				{subtitle && <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{subtitle}</p>}
			</div>
			<div className="h-[320px] w-full">{children}</div>
		</Card>
	);
};
