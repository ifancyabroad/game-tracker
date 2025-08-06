import { useMemo } from "react";
import { usePlayers } from "features/players/context/PlayersContext";
import { useResults } from "features/events/context/ResultsContext";
import { Avatar } from "common/components/Avatar";
import { Trophy } from "lucide-react";
import type { IPlayer } from "features/players/types";

export const HomePage: React.FC = () => {
	const { players } = usePlayers();
	const { results } = useResults();

	const leaderboard = useMemo(() => {
		const stats: Record<string, { wins: number; games: number }> = {};

		results.forEach((r) => {
			r.playerResults.forEach((pr) => {
				if (!stats[pr.playerId]) stats[pr.playerId] = { wins: 0, games: 0 };
				if (pr.isWinner || pr.rank === 1) stats[pr.playerId].wins++;
				stats[pr.playerId].games++;
			});
		});

		return Object.entries(stats)
			.map(([playerId, { wins, games }]) => ({
				player: players.find((p) => p.id === playerId),
				wins,
				games,
				winRate: games ? Math.round((wins / games) * 100) : 0,
			}))
			.filter((p) => p.player)
			.sort((a, b) => b.wins - a.wins);
	}, [results, players]);

	const mostGamesPlayer = leaderboard[0];
	const bestWinRatePlayer = [...leaderboard]
		.filter((p) => p.games >= 5) // minimum threshold
		.sort((a, b) => b.winRate - a.winRate)[0];
	const mostWinsPlayer = leaderboard[0];

	return (
		<div className="space-y-10">
			<h2 className="text-3xl font-bold text-white">Leaderboard</h2>

			{/* Featured Stats */}
			<div className="grid gap-4 sm:grid-cols-3">
				<FeaturedStatCard
					label="Most Games Played"
					player={mostGamesPlayer?.player}
					value={`${mostGamesPlayer?.games ?? 0} games`}
				/>
				<FeaturedStatCard
					label="Best Win Rate"
					player={bestWinRatePlayer?.player}
					value={`${bestWinRatePlayer?.winRate ?? 0}%`}
				/>
				<FeaturedStatCard
					label="Most Wins"
					player={mostWinsPlayer?.player}
					value={`${mostWinsPlayer?.wins ?? 0} wins`}
				/>
			</div>

			{/* Leaderboard Table */}
			<div className="overflow-x-auto rounded-xl border border-gray-700 bg-[var(--color-surface)]">
				<table className="min-w-full divide-y divide-gray-700 text-sm">
					<thead>
						<tr className="bg-gray-800 text-gray-300">
							<th className="px-2 py-3 text-center">#</th>
							<th className="px-4 py-3 text-left">Player</th>
							<th className="px-4 py-3 text-left">Win %</th>
							<th className="px-4 py-3 text-left">Games</th>
							<th className="px-4 py-3 text-left">Wins</th>
						</tr>
					</thead>
					<tbody>
						{leaderboard.map(({ player, games, wins, winRate }, index) => (
							<tr
								key={player!.id}
								className={`${
									index === 0
										? "border-b border-yellow-500/20 bg-yellow-900/30"
										: index === 1
											? "border-b border-gray-500/20 bg-gray-700/30"
											: index === 2
												? "border-b border-orange-500/20 bg-orange-900/30"
												: "border-b border-gray-800"
								} last:border-b-0`}
							>
								<td className="px-2 py-3 text-center font-semibold text-gray-400">
									{index === 0 || index === 1 || index === 2 ? (
										<Trophy
											className={`inline-block ${
												index === 0
													? "text-yellow-400"
													: index === 1
														? "text-gray-400"
														: "text-orange-400"
											}`}
											size={18}
										/>
									) : (
										index + 1
									)}
								</td>
								<td className="flex items-center gap-2 px-4 py-3 font-medium text-white">
									<Avatar
										src={player?.pictureUrl || undefined}
										name={player?.preferredName ?? "?"}
										size={32}
									/>
									{player?.preferredName ?? "Unknown"}
								</td>
								<td className="px-4 py-3 text-gray-300">{winRate}%</td>
								<td className="px-4 py-3 text-gray-300">{games}</td>
								<td className="px-4 py-3 font-semibold text-gray-300">{wins}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default HomePage;

interface FeaturedStatCardProps {
	label: string;
	player?: IPlayer;
	value: string;
}

const FeaturedStatCard: React.FC<FeaturedStatCardProps> = ({ label, player, value }) => {
	return (
		<div className="flex items-center gap-4 rounded-lg border border-gray-700 bg-[var(--color-surface)] p-4 shadow-sm">
			<Avatar src={player?.pictureUrl || undefined} name={player?.preferredName ?? "?"} size={48} />
			<div>
				<p className="text-xs text-gray-400">{label}</p>
				<p className="leading-tight font-semibold text-white">{player?.preferredName ?? "Unknown"}</p>
				<p className="text-sm text-gray-300">{value}</p>
			</div>
		</div>
	);
};
