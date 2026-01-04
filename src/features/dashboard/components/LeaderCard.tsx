import { Link } from "react-router";
import { Card, Avatar } from "common/components";
import { getDisplayName } from "features/players/utils/helpers";
import type { PlayerWithData } from "features/players/types";

interface ILeaderCardProps {
	player: PlayerWithData;
	rank: number;
}

const getRankColor = (rank: number) => {
	if (rank === 1) return "text-[var(--color-gold)] bg-[var(--color-gold)]/10";
	if (rank === 2) return "text-[var(--color-silver)] bg-[var(--color-silver)]/10";
	if (rank === 3) return "text-[var(--color-bronze)] bg-[var(--color-bronze)]/10";
	return "text-[var(--color-text-secondary)] bg-[var(--color-accent)]";
};

export const LeaderCard: React.FC<ILeaderCardProps> = ({ player, rank }) => {
	const displayName = getDisplayName(player);
	const { points, wins, winRatePercent } = player.data;
	const rankColor = getRankColor(rank);

	return (
		<Link to={`/players/${player.id}`}>
			<Card variant="interactive" className="overflow-hidden rounded-t-none p-0 transition-all hover:shadow-lg">
				{/* Colored Top Bar */}
				<div
					className={`h-1 w-full ${rank === 1 ? "bg-[var(--color-gold)]" : rank === 2 ? "bg-[var(--color-silver)]" : rank === 3 ? "bg-[var(--color-bronze)]" : "bg-[var(--color-border)]"}`}
				/>

				<div className="p-4">
					{/* Rank and Avatar Row */}
					<div className="mb-4 flex items-center gap-3">
						<div
							className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-xl font-bold ${rankColor}`}
						>
							{rank}
						</div>
						<Avatar src={player.pictureUrl || undefined} name={displayName} size={56} />
						<div className="min-w-0 flex-1">
							<h3 className="truncate text-base font-bold text-[var(--color-text)] md:text-lg">
								{displayName}
							</h3>
						</div>
					</div>

					{/* Stats Row */}
					<div className="grid grid-cols-3 gap-2 text-center">
						<div className="rounded-lg bg-[var(--color-accent)] p-2">
							<p className="text-lg font-bold text-[var(--color-text)] md:text-xl">{points}</p>
							<p className="text-xs text-[var(--color-text-secondary)]">Points</p>
						</div>
						<div className="rounded-lg bg-[var(--color-accent)] p-2">
							<p className="text-lg font-bold text-[var(--color-text)] md:text-xl">{wins}</p>
							<p className="text-xs text-[var(--color-text-secondary)]">Wins</p>
						</div>
						<div className="rounded-lg bg-[var(--color-accent)] p-2">
							<p className="text-lg font-bold text-[var(--color-text)] md:text-xl">{winRatePercent}%</p>
							<p className="text-xs text-[var(--color-text-secondary)]">Win Rate</p>
						</div>
					</div>
				</div>
			</Card>
		</Link>
	);
};
