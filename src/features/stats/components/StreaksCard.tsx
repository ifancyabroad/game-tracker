import { Card } from "common/components";
import { TrendingUp, TrendingDown, Flame, CloudRain } from "lucide-react";
import { Link } from "react-router";
import type { StreakPlayer } from "features/stats/types";

interface StreaksCardProps {
	streaks: StreakPlayer[];
	type: "win" | "loss";
}

export const StreaksCard: React.FC<StreaksCardProps> = ({ streaks, type }) => {
	const isWinStreak = type === "win";

	const Icon = isWinStreak ? Flame : CloudRain;
	const TrendIcon = isWinStreak ? TrendingUp : TrendingDown;
	const iconColor = isWinStreak ? "text-orange-500" : "text-blue-400";
	const title = isWinStreak ? "Win Streaks" : "Loss Streaks";
	const streakType = isWinStreak ? "wins" : "losses";
	const emptyMessage = isWinStreak ? "winning streaks" : "losing streaks";

	return (
		<Card className="p-4 sm:p-6">
			<div className="mb-4 flex items-center gap-2">
				<Icon className={`h-5 w-5 ${iconColor}`} />
				<h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
			</div>

			{streaks.length === 0 ? (
				<div className="py-8 text-center">
					<p className="text-sm text-[var(--color-text-secondary)]">No streak data yet</p>
					<p className="text-xs text-[var(--color-text-muted)]">Play some games to see {emptyMessage}</p>
				</div>
			) : (
				<div className="space-y-2">
					{streaks.map((player, index) => (
						<Link
							key={player.playerId}
							to={`/players/${player.playerId}`}
							className="flex items-center justify-between rounded-lg bg-[var(--color-accent)] p-3 transition-colors hover:bg-[var(--color-hover)]"
						>
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center text-sm font-bold text-[var(--color-text-secondary)]">
									#{index + 1}
								</div>
								<div
									className="flex h-10 w-10 items-center justify-center rounded-lg"
									style={{ backgroundColor: `${player.playerColor}20` }}
								>
									<TrendIcon size={20} style={{ color: player.playerColor }} />
								</div>
								<div>
									<p className="font-semibold text-[var(--color-text)]">{player.playerName}</p>
									<p className="text-xs text-[var(--color-text-secondary)]">
										Consecutive {streakType}
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="text-2xl font-bold" style={{ color: player.playerColor }}>
									{player.streak}
								</p>
								<p className="text-xs text-[var(--color-text-secondary)]">
									{player.streak === 1 ? "game" : "games"}
								</p>
							</div>
						</Link>
					))}
				</div>
			)}
		</Card>
	);
};
