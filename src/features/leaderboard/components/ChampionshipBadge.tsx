import { Trophy } from "lucide-react";

export const ChampionshipBadge: React.FC = () => {
	return (
		<div
			className="gradient-gold inline-flex items-center gap-0.5 rounded-full border border-[var(--color-gold)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--color-gold-contrast)] shadow-sm sm:px-2 sm:text-[10px]"
			title="Champion"
		>
			<Trophy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
		</div>
	);
};
