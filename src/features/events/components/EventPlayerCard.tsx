import { Link } from "react-router";
import { TrendingUp, TrendingDown } from "lucide-react";
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
			className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)] p-2 transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:hover:bg-[var(--color-hover)]"
		>
			<Avatar src={stat.player?.pictureUrl || undefined} name={stat.name} size={32} />
			<div className="min-w-0 flex-1">
				<div className="truncate text-sm font-medium text-[var(--color-text)]">{stat.name}</div>
				<div className="text-xs text-[var(--color-text-secondary)]">
					{stat.gamesPlayed} {pluralize(stat.gamesPlayed, "game")}
				</div>
			</div>
			<div className="flex items-center gap-1.5">
				{stat.points > 0 && (
					<div className="flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-1">
						<TrendingUp className="h-3.5 w-3.5 text-green-500" />
						<span className="text-xs font-semibold text-green-500">+{stat.points}</span>
					</div>
				)}
				{stat.points < 0 && (
					<div className="flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1">
						<TrendingDown className="h-3.5 w-3.5 text-red-400" />
						<span className="text-xs font-semibold text-red-400">{stat.points}</span>
					</div>
				)}
			</div>
		</Link>
	);
};
