import type { TopOpponent } from "features/players/types";
import { useNavigate } from "react-router";
import { Card } from "common/components";
interface HeadToHeadTableProps {
	topOpponents: TopOpponent[];
}

export const HeadToHeadTable: React.FC<HeadToHeadTableProps> = ({ topOpponents }) => {
	const navigate = useNavigate();

	const handleNavigateToOpponent = (opponentId: string) => {
		navigate(`/players/${opponentId}`);
	};

	return (
		<Card className="p-0">
			<div className="border-b border-[var(--color-border)] px-3 py-2.5 sm:px-4 sm:py-3">
				<h2 className="text-base font-semibold text-[var(--color-text)]">Head-to-Head (Top 5)</h2>
				<p className="text-xs text-[var(--color-text-secondary)]">Most common opponents</p>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead className="bg-[var(--color-accent)] text-left text-[var(--color-text-secondary)]">
						<tr>
							<th className="px-3 py-2 sm:px-4">Opponent</th>
							<th className="w-20 px-2 py-2 text-center sm:w-24 sm:px-4">Games</th>
							<th className="w-20 px-2 py-2 text-center sm:w-24 sm:px-4">Wins</th>
							<th className="w-20 px-2 py-2 text-center sm:w-24 sm:px-4">Losses</th>
						</tr>
					</thead>
					<tbody>
						{topOpponents.length ? (
							topOpponents.map((o) => (
								<tr
									key={o.opponentId}
									className="cursor-pointer border-b border-[var(--color-border)] last:border-b-0 hover:hover:bg-[var(--color-hover)]"
									onClick={() => handleNavigateToOpponent(o.opponentId)}
								>
									<td className="px-3 py-2 text-[var(--color-text)] sm:px-4">{o.name}</td>
									<td className="px-2 py-2 text-center text-[var(--color-text)] tabular-nums sm:px-4">
										{o.games}
									</td>
									<td className="px-2 py-2 text-center text-[var(--color-text)] tabular-nums sm:px-4">
										{o.wins}
									</td>
									<td className="px-2 py-2 text-center text-[var(--color-text)] tabular-nums sm:px-4">
										{o.losses}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={4} className="px-4 py-6 text-center text-[var(--color-text-secondary)]">
									No opponent data yet.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</Card>
	);
};
