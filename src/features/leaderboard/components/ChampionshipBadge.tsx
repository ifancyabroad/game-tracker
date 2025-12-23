import { Trophy } from "lucide-react";

interface ChampionshipBadgeProps {
	year: number;
}

export const ChampionshipBadge: React.FC<ChampionshipBadgeProps> = ({ year }) => {
	return (
		<div
			className="inline-flex items-center gap-0.5 rounded-full border border-yellow-500 bg-gradient-to-br from-yellow-400 to-yellow-600 px-1.5 py-0.5 text-[9px] font-bold text-yellow-950 shadow-sm sm:px-2 sm:text-[10px]"
			title={`${year} Champion`}
		>
			<Trophy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
			<span>'{year.toString().slice(-2)}</span>
		</div>
	);
};
