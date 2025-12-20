import { Card } from "common/components";
import { TrendingDown, CloudRain } from "lucide-react";
import { Link } from "react-router";
import type { StreakPlayer } from "features/stats/utils/stats";

interface LossStreaksCardProps {
	streaks: StreakPlayer[];
}

export const LossStreaksCard: React.FC<LossStreaksCardProps> = ({ streaks }) => {
	return (
		<Card className="p-4 sm:p-6">
			<div className="mb-4 flex items-center gap-2">
				<CloudRain className="h-5 w-5 text-blue-400" />
				<h3 className="text-base font-semibold text-white sm:text-lg">Loss Streaks</h3>
			</div>

			{streaks.length === 0 ? (
				<div className="py-8 text-center">
					<p className="text-sm text-gray-400">No streak data yet</p>
					<p className="text-xs text-gray-500">Play some games to see losing streaks</p>
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
									<TrendingDown size={20} style={{ color: player.playerColor }} />
								</div>
								<div>
									<p className="font-semibold text-white">{player.playerName}</p>
									<p className="text-xs text-gray-400">Consecutive losses</p>
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
