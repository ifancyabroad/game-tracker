import { Link } from "react-router";
import { Trophy, Medal, Award, Target, TrendingUp } from "lucide-react";
import type { PlayerWithData } from "features/players/utils/stats";
import { Avatar, Card } from "common/components";
import { calculateWinRatePercent } from "common/utils/calculations";

const getTintBg = (rank: number) => {
	if (rank === 1) return "bg-gradient-to-br from-yellow-500/15 via-yellow-500/5 to-transparent";
	if (rank === 2) return "bg-gradient-to-br from-slate-400/15 via-slate-400/5 to-transparent";
	if (rank === 3) return "bg-gradient-to-br from-amber-600/15 via-amber-600/5 to-transparent";
	return "";
};

const getTintBar = (rank: number) => {
	if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-500/50";
	if (rank === 2) return "bg-gradient-to-r from-slate-300 to-slate-400 shadow-lg shadow-slate-400/50";
	if (rank === 3) return "bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/50";
	return "bg-gradient-to-r from-indigo-400 to-indigo-500";
};

const getRankStyles = (rank: number) => {
	if (rank === 1)
		return {
			badge: "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950 border-yellow-400/50",
			icon: <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
		};
	if (rank === 2)
		return {
			badge: "bg-gradient-to-br from-slate-300 to-slate-500 text-slate-950 border-slate-400/50",
			icon: <Medal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
		};
	if (rank === 3)
		return {
			badge: "bg-gradient-to-br from-amber-500 to-amber-700 text-amber-950 border-amber-500/50",
			icon: <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
		};
	return {
		badge: "bg-[var(--color-accent)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
		icon: null,
	};
};

export const PlayerCard: React.FC<{
	row: PlayerWithData;
	rank: number;
	maxPoints: number;
}> = ({ row, rank, maxPoints }) => {
	const {
		id,
		pictureUrl,
		data: { points, wins, games, winRatePercent, name },
	} = row;
	const tintBg = getTintBg(rank);
	const tintBar = getTintBar(rank);
	const rankStyles = getRankStyles(rank);
	const pct = calculateWinRatePercent(points, maxPoints);

	return (
		<Link to={`/players/${id}`} className="relative block">
			<Card variant="interactive" className={`relative overflow-hidden p-3 sm:p-4 ${tintBg}`}>
				<div className="flex items-center gap-2 sm:gap-4">
					{/* Rank Badge - Consistent size for alignment */}
					<div
						className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 font-bold shadow-lg sm:h-11 sm:w-11 ${rankStyles.badge}`}
					>
						{rankStyles.icon || <span className="text-xs sm:text-sm">{rank}</span>}
					</div>

					{/* Avatar - Smaller on mobile */}
					<Avatar src={pictureUrl || undefined} name={name} size={48} />

					{/* Player Info */}
					<div className="min-w-0 flex-1">
						<div className="flex items-baseline justify-between gap-2">
							<h3 className="truncate text-sm font-semibold text-[var(--color-text)] sm:text-lg">
								{name}
							</h3>
							<div className="flex shrink-0 items-baseline gap-0.5 sm:gap-1">
								<span className="text-lg font-bold text-[var(--color-text)] tabular-nums sm:text-2xl">
									{points}
								</span>
								<span className="text-[10px] font-medium text-[var(--color-text-secondary)] sm:text-xs">
									pts
								</span>
							</div>
						</div>

						{/* Stats Row - Compact on mobile */}
						<div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] sm:mt-1.5 sm:gap-3 sm:text-xs">
							<div className="flex items-center gap-1 text-[var(--color-text)]">
								<Target className="h-3 w-3 text-[var(--color-primary)] sm:h-3.5 sm:w-3.5" />
								<span className="font-semibold">{winRatePercent}%</span>
								<span className="hidden text-[var(--color-text-muted)] sm:inline">win rate</span>
							</div>
							<span className="text-[var(--color-text-muted)]">|</span>
							<div className="flex items-center gap-1 text-[var(--color-text-muted)]">
								<TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
								<span>{wins}w</span>
							</div>
							<span className="text-[var(--color-text-muted)]">|</span>
							<div className="text-[var(--color-text-muted)]">
								<span>{games}p</span>
							</div>
						</div>

						{/* Progress Bar */}
						<div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border)] shadow-inner sm:mt-2.5 sm:h-2">
							<div
								className={`h-full rounded-full transition-all duration-500 ${tintBar}`}
								style={{ width: `${pct}%` }}
							/>
						</div>
					</div>
				</div>
			</Card>
		</Link>
	);
};
