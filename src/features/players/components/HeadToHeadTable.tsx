import type { TopOpponent } from "features/players/utils/stats";
import { useNavigate } from "react-router";

interface HeadToHeadTableProps {
	topOpponents: TopOpponent[];
}

export const HeadToHeadTable: React.FC<HeadToHeadTableProps> = ({ topOpponents }) => {
	const navigate = useNavigate();

	const handleNavigateToOpponent = (opponentId: string) => {
		navigate(`/players/${opponentId}`);
	};

	return (
		<div className="rounded-xl border border-gray-700 bg-[var(--color-surface)]">
			<div className="border-b border-gray-700 px-3 py-2.5 sm:px-4 sm:py-3">
				<h2 className="text-base font-semibold text-white">Head-to-Head (Top 5)</h2>
				<p className="text-xs text-gray-400">Most common opponents</p>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead className="bg-black/20 text-left text-gray-300">
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
									className="cursor-pointer border-b border-gray-700 last:border-b-0 hover:bg-white/5"
									onClick={() => handleNavigateToOpponent(o.opponentId)}
								>
									<td className="px-3 py-2 text-white sm:px-4">{o.name}</td>
									<td className="px-2 py-2 text-center text-gray-200 tabular-nums sm:px-4">
										{o.games}
									</td>
									<td className="px-2 py-2 text-center text-gray-200 tabular-nums sm:px-4">
										{o.wins}
									</td>
									<td className="px-2 py-2 text-center text-gray-200 tabular-nums sm:px-4">
										{o.losses}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={4} className="px-4 py-6 text-center text-gray-400">
									No opponent data yet.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
