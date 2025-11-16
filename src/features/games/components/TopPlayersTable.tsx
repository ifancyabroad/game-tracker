import type { PlayerGameStats } from "features/games/utils/stats";
import { useNavigate } from "react-router";

interface TopPlayersTableProps {
	playerStats: PlayerGameStats[];
}

export const TopPlayersTable: React.FC<TopPlayersTableProps> = ({ playerStats }) => {
	const navigate = useNavigate();

	const handleNavigateToPlayer = (playerId: string) => {
		navigate(`/players/${playerId}`);
	};

	return (
		<div className="rounded-xl border border-gray-700 bg-[var(--color-surface)]">
			<div className="border-b border-gray-700 px-4 py-3">
				<h2 className="text-base font-semibold text-white">Top Players</h2>
				<p className="text-xs text-gray-400">Top 10 players by number of games played</p>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead className="bg-black/20 text-left text-gray-300">
						<tr>
							<th className="px-4 py-2">Player</th>
							<th className="w-24 px-4 py-2 text-center">Games</th>
							<th className="w-24 px-4 py-2 text-center">Wins</th>
							<th className="w-24 px-4 py-2 text-center">Win %</th>
						</tr>
					</thead>
					<tbody>
						{playerStats.length ? (
							playerStats
								.slice()
								.sort((a, b) => b.games - a.games)
								.slice(0, 10)
								.map((p) => (
									<tr
										key={p.playerId}
										className="cursor-pointer border-b border-gray-700 last:border-b-0 hover:bg-white/5"
										onClick={() => handleNavigateToPlayer(p.playerId)}
									>
										<td className="px-4 py-2 text-white">{p.name}</td>
										<td className="px-4 py-2 text-center text-gray-200 tabular-nums">{p.games}</td>
										<td className="px-4 py-2 text-center text-gray-200 tabular-nums">{p.wins}</td>
										<td className="px-4 py-2 text-center text-gray-200 tabular-nums">
											{Math.round(p.winRate * 100)}%
										</td>
									</tr>
								))
						) : (
							<tr>
								<td colSpan={5} className="px-4 py-6 text-center text-gray-400">
									No player stats yet.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
