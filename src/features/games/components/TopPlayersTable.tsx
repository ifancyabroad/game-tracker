import type { PlayerGameStats } from "features/games/utils/stats";
import { useNavigate } from "react-router";
import { Card } from "common/components";
import { formatPct } from "common/utils/helpers";

interface TopPlayersTableProps {
	playerStats: PlayerGameStats[];
}

export const TopPlayersTable: React.FC<TopPlayersTableProps> = ({ playerStats }) => {
	const navigate = useNavigate();

	const handleNavigateToPlayer = (playerId: string) => {
		navigate(`/players/${playerId}`);
	};

	return (
		<Card className="p-0">
			<div className="border-b border-[var(--color-border)] px-3 py-2.5 sm:px-4 sm:py-3">
				<h2 className="text-base font-semibold text-[var(--color-text)]">Top Players</h2>
				<p className="text-xs text-[var(--color-text-secondary)]">Top 10 players by number of games played</p>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead className="bg-[var(--color-accent)] text-left text-[var(--color-text-secondary)]">
						<tr>
							<th className="px-3 py-2 sm:px-4">Player</th>
							<th className="w-20 px-2 py-2 text-center sm:w-24 sm:px-4">Games</th>
							<th className="w-20 px-2 py-2 text-center sm:w-24 sm:px-4">Wins</th>
							<th className="w-20 px-2 py-2 text-center sm:w-24 sm:px-4">Win %</th>
						</tr>
					</thead>
					<tbody>
						{playerStats.length ? (
							playerStats
								.slice()
								.sort((a, b) => b.games - a.games || b.wins - a.wins)
								.slice(0, 10)
								.map((p) => (
									<tr
										key={p.playerId}
										className="cursor-pointer border-b border-[var(--color-border)] last:border-b-0 hover:hover:bg-[var(--color-hover)]"
										onClick={() => handleNavigateToPlayer(p.playerId)}
									>
										<td className="px-3 py-2 text-[var(--color-text)] sm:px-4">{p.name}</td>
										<td className="px-2 py-2 text-center text-[var(--color-text)] tabular-nums sm:px-4">
											{p.games}
										</td>
										<td className="px-2 py-2 text-center text-[var(--color-text)] tabular-nums sm:px-4">
											{p.wins}
										</td>
										<td className="px-2 py-2 text-center text-[var(--color-text)] tabular-nums sm:px-4">
											{formatPct(p.winRate)}
										</td>
									</tr>
								))
						) : (
							<tr>
								<td colSpan={5} className="px-4 py-6 text-center text-[var(--color-text-secondary)]">
									No player stats yet.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</Card>
	);
};
