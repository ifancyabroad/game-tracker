import { Link } from "react-router";
import { Avatar } from "common/components";
import { getDisplayName } from "features/players/utils/helpers";
import { DISPLAY_LIMITS } from "common/utils/constants";
import type { IEventGameStat } from "features/events/types";

interface IEventGameCardProps {
	stat: IEventGameStat;
}

export const EventGameCard: React.FC<IEventGameCardProps> = ({ stat }) => {
	return (
		<Link
			to={`/games/${stat.gameId}`}
			className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)] p-2 transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:hover:bg-[var(--color-hover)]"
		>
			<div className="min-w-0 flex-1">
				<div className="truncate text-sm font-medium text-[var(--color-text)]">{stat.name}</div>
				<div className="text-xs text-[var(--color-text-secondary)]">
					Played {stat.timesPlayed} {stat.timesPlayed === 1 ? "time" : "times"}
				</div>
			</div>
			{(stat.winners.length > 0 || stat.losers.length > 0) && (
				<div className="flex flex-col gap-1.5">
					{stat.winners.length > 0 && (
						<div className="flex -space-x-1.5">
							{stat.winners.slice(0, DISPLAY_LIMITS.UI.EVENT_CARD_MAX_AVATARS).map((winner, idx) => (
								<div
									key={`${stat.gameId}-win-${winner?.id}-${idx}`}
									className="rounded-full"
									title={`Winner: ${getDisplayName(winner)}`}
								>
									<Avatar
										src={winner?.pictureUrl || undefined}
										name={getDisplayName(winner)}
										size={24}
									/>
								</div>
							))}
							{stat.winners.length > DISPLAY_LIMITS.UI.EVENT_CARD_MAX_AVATARS && (
								<div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/20 text-xs font-semibold text-yellow-500 ring-2 ring-yellow-500">
									+{stat.winners.length - DISPLAY_LIMITS.UI.EVENT_CARD_MAX_AVATARS}
								</div>
							)}
						</div>
					)}
					{stat.losers.length > 0 && (
						<div className="flex -space-x-1.5">
							{stat.losers.slice(0, DISPLAY_LIMITS.UI.EVENT_CARD_MAX_AVATARS).map((loser, idx) => (
								<div
									key={`${stat.gameId}-loss-${loser?.id}-${idx}`}
									className="rounded-full ring-2 ring-red-500"
									title={`Loser: ${getDisplayName(loser)}`}
								>
									<Avatar
										src={loser?.pictureUrl || undefined}
										name={getDisplayName(loser)}
										size={24}
									/>
								</div>
							))}
							{stat.losers.length > DISPLAY_LIMITS.UI.EVENT_CARD_MAX_AVATARS && (
								<div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-xs font-semibold text-red-400 ring-2 ring-red-500">
									+{stat.losers.length - DISPLAY_LIMITS.UI.EVENT_CARD_MAX_AVATARS}
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</Link>
	);
};
