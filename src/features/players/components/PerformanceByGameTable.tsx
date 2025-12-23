import type { GameWinRateRow } from "features/players/types";
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
			<div className="border-b border-[var(--color-border)] px-3 py-2.5 sm:px-4 sm:py-3">
				<h2 className="text-base font-semibold text-[var(--color-text)]">Performance by Game</h2>
				<p className="text-xs text-[var(--color-text-secondary)]">Top games by play count</p>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead className="bg-[var(--color-accent)] text-left text-[var(--color-text-secondary)]">
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
							.sort((a, b) => b.games - a.games || b.wins - a.wins)
							.slice(0, 5)
							.map((g) => (
								<tr
									key={g.gameId}
									className="cursor-pointer border-b border-[var(--color-border)] last:border-b-0 hover:hover:bg-[var(--color-hover)]"
									onClick={() => handleNavigateToGame(g.gameId)}
								>
									<td className="px-3 py-2 text-[var(--color-text)] sm:px-4">{g.name}</td>
									<td className="px-2 py-2 text-center text-[var(--color-text)] tabular-nums sm:px-4">
										{g.games}
									</td>
									<td className="px-2 py-2 text-center text-[var(--color-text)] tabular-nums sm:px-4">
										{g.wins}
									</td>
									<td className="px-2 py-2 text-center text-[var(--color-text)] tabular-nums sm:px-4">
										{formatPct(g.wr)}
									</td>
								</tr>
							))}
						{gameWinRates.length === 0 && (
							<tr>
								<td colSpan={4} className="px-4 py-6 text-center text-[var(--color-text-secondary)]">
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
