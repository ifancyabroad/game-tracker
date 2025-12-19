import { Link } from "react-router";
import { Award, Frown } from "lucide-react";
import { Avatar } from "common/components";
import type { IEventPlayerStat } from "features/events/utils/stats";
import { pluralize } from "common/utils/helpers";

interface IEventPlayerCardProps {
	stat: IEventPlayerStat;
}

export const EventPlayerCard: React.FC<IEventPlayerCardProps> = ({ stat }) => {
	return (
		<Link
			to={`/players/${stat.playerId}`}
			className="flex items-center gap-3 rounded-lg border border-gray-700 bg-black/20 p-2 transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:bg-black/40"
		>
			<Avatar src={stat.player?.pictureUrl || undefined} name={stat.name} size={32} />
			<div className="min-w-0 flex-1">
				<div className="truncate text-sm font-medium text-white">{stat.name}</div>
				<div className="text-xs text-gray-400">
					{stat.gamesPlayed} {pluralize(stat.gamesPlayed, "game")}
				</div>
			</div>
			<div className="flex items-center gap-1.5">
				{stat.wins > 0 && (
					<div className="flex items-center gap-1 rounded-md bg-yellow-500/10 px-2 py-1">
						<Award className="h-3.5 w-3.5 text-yellow-500" />
						<span className="text-xs font-semibold text-yellow-500">{stat.wins}</span>
					</div>
				)}
				{stat.losses > 0 && (
					<div className="flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1">
						<Frown className="h-3.5 w-3.5 text-red-400" />
						<span className="text-xs font-semibold text-red-400">{stat.losses}</span>
					</div>
				)}
			</div>
		</Link>
	);
};
