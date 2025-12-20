import { Card } from "common/components";
import { TrendingUp, Flame } from "lucide-react";
import { Link } from "react-router";
import type { StreakPlayer } from "features/stats/utils/stats";

interface WinStreaksCardProps {
	streaks: StreakPlayer[];
}

export const WinStreaksCard: React.FC<WinStreaksCardProps> = ({ streaks }) => {
	return (
		<Card className="p-4 sm:p-6">
			<div className="mb-4 flex items-center gap-2">
				<Flame className="h-5 w-5 text-orange-500" />
				<h3 className="text-base font-semibold text-white sm:text-lg">Win Streaks</h3>
			</div>

			{streaks.length === 0 ? (
				<div className="py-8 text-center">
					<p className="text-sm text-gray-400">No streak data yet</p>
					<p className="text-xs text-gray-500">Play some games to see winning streaks</p>
				</div>
			) : (
				<div className="space-y-2">
					{streaks.map((player, index) => (
						<Link
							key={player.playerId}
							to={`/players/${player.playerId}`}
							className="flex items-center justify-between rounded-lg bg-black/30 p-3 transition-colors hover:bg-black/40"
						>
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center text-sm font-bold text-gray-400">
									#{index + 1}
								</div>
								<div
									className="flex h-10 w-10 items-center justify-center rounded-lg"
									style={{ backgroundColor: `${player.playerColor}20` }}
								>
									<TrendingUp size={20} style={{ color: player.playerColor }} />
								</div>
								<div>
									<p className="font-semibold text-white">{player.playerName}</p>
									<p className="text-xs text-gray-400">Consecutive wins</p>
								</div>
							</div>
							<div className="text-right">
								<p className="text-2xl font-bold" style={{ color: player.playerColor }}>
									{player.streak}
								</p>
								<p className="text-xs text-gray-400">{player.streak === 1 ? "game" : "games"}</p>
							</div>
						</Link>
					))}
				</div>
			)}
		</Card>
	);
};
