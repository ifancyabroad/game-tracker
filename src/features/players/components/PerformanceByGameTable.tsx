import type { GameWinRateRow } from "features/players/utils/stats";
import { useNavigate } from "react-router";
import { Card } from "common/components";
import { formatPct } from "common/utils/helpers";

interface PerformanceByGameTableProps {
	gameWinRates: GameWinRateRow[];
}

export const PerformanceByGameTable: React.FC<PerformanceByGameTableProps> = ({ gameWinRates }) => {
	const navigate = useNavigate();

	const handleNavigateToGame = (gameId: string) => {
		navigate(`/games/${gameId}`);
	};

	return (
		<Card className="p-0">
			<div className="border-b border-gray-700 px-3 py-2.5 sm:px-4 sm:py-3">
				<h2 className="text-base font-semibold text-white">Performance by Game</h2>
				<p className="text-xs text-gray-400">Top games by play count</p>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead className="bg-black/20 text-left text-gray-300">
						<tr>
							<th className="px-3 py-2 sm:px-4">Game</th>
							<th className="w-20 px-2 py-2 text-center sm:w-24 sm:px-4">Games</th>
							<th className="w-20 px-2 py-2 text-center sm:w-24 sm:px-4">Wins</th>
							<th className="w-20 px-2 py-2 text-center sm:w-24 sm:px-4">Win %</th>
						</tr>
					</thead>
					<tbody>
						{gameWinRates
							.slice()
							.sort((a, b) => b.games - a.games)
							.slice(0, 5)
							.map((g) => (
								<tr
									key={g.gameId}
									className="cursor-pointer border-b border-gray-700 last:border-b-0 hover:bg-white/5"
									onClick={() => handleNavigateToGame(g.gameId)}
								>
									<td className="px-3 py-2 text-white sm:px-4">{g.name}</td>
									<td className="px-2 py-2 text-center text-gray-200 tabular-nums sm:px-4">
										{g.games}
									</td>
									<td className="px-2 py-2 text-center text-gray-200 tabular-nums sm:px-4">
										{g.wins}
									</td>
									<td className="px-2 py-2 text-center text-gray-200 tabular-nums sm:px-4">
										{formatPct(g.wr)}
									</td>
								</tr>
							))}
						{gameWinRates.length === 0 && (
							<tr>
								<td colSpan={4} className="px-4 py-6 text-center text-gray-400">
									No game stats yet.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</Card>
	);
};
