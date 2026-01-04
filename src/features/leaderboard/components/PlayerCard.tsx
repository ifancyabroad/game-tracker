import { Link } from "react-router";
import { Trophy, Medal, Award, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { PlayerWithData } from "features/players/types";
import { Avatar, Card } from "common/components";
import { calculateWinRatePercent } from "common/utils/calculations";
import { ChampionshipBadge } from "./ChampionshipBadge";

const getTintBg = (rank: number) => {
	if (rank === 1) return "bg-gradient-to-br from-[var(--color-gold)]/15 via-[var(--color-gold)]/5 to-transparent";
	if (rank === 2) return "bg-gradient-to-br from-[var(--color-silver)]/15 via-[var(--color-silver)]/5 to-transparent";
	if (rank === 3) return "bg-gradient-to-br from-[var(--color-bronze)]/15 via-[var(--color-bronze)]/5 to-transparent";
	return "";
};

const getRankStyles = (rank: number) => {
	if (rank === 1)
		return {
			badge: "gradient-gold text-[var(--color-gold-contrast)] border-[var(--color-gold)]/50",
			icon: <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
		};
	if (rank === 2)
		return {
			badge: "gradient-silver text-[var(--color-silver-contrast)] border-[var(--color-silver)]/50",
			icon: <Medal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
		};
	if (rank === 3)
		return {
			badge: "gradient-bronze text-[var(--color-bronze-contrast)] border-[var(--color-bronze)]/50",
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
	championshipYears?: number[];
}> = ({ row, rank, maxPoints, championshipYears = [] }) => {
	const {
		id,
		pictureUrl,
		color,
		data: { points, wins, games, winRatePercent, name },
	} = row;
	const tintBg = getTintBg(rank);
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
							<div className="flex min-w-0 flex-1 items-center gap-1.5">
								<h3 className="truncate text-sm font-semibold text-[var(--color-text)] sm:text-lg">
									{name}
								</h3>
								{championshipYears.length > 0 && (
									<div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
										{championshipYears.map((year) => (
											<ChampionshipBadge key={year} year={year} />
										))}
									</div>
								)}
							</div>
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
							<motion.div
								className="h-full rounded-full"
								style={{ backgroundColor: color }}
								initial={{ width: 0 }}
								animate={{ width: `${pct}%` }}
								transition={{
									duration: 1,
									delay: rank * 0.05,
									ease: [0.4, 0, 0.2, 1],
								}}
							/>
						</div>
					</div>
				</div>
			</Card>
		</Link>
	);
};
