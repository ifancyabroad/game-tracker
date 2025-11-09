import type { TopOpponent } from "features/players/utils/stats";

interface HeadToHeadTableProps {
	topOpponents: TopOpponent[];
}

export const HeadToHeadTable: React.FC<HeadToHeadTableProps> = ({ topOpponents }) => (
	<div className="rounded-xl border border-gray-700 bg-[var(--color-surface)]">
		<div className="border-b border-gray-700 px-4 py-3">
			<h2 className="text-base font-semibold text-white">Head-to-Head (Top 5)</h2>
			<p className="text-xs text-gray-400">Most common opponents</p>
		</div>
		<div className="overflow-x-auto">
			<table className="w-full text-sm">
				<thead className="bg-black/20 text-left text-gray-300">
					<tr>
						<th className="px-4 py-2">Opponent</th>
						<th className="w-24 px-4 py-2 text-center">Games</th>
						<th className="w-24 px-4 py-2 text-center">Wins</th>
						<th className="w-24 px-4 py-2 text-center">Win %</th>
					</tr>
				</thead>
				<tbody>
					{topOpponents.length ? (
						topOpponents.map((o) => (
							<tr
								key={o.opponentId}
								className="border-b border-gray-700 last:border-b-0 hover:bg-white/5"
							>
								<td className="px-4 py-2 text-white">{o.name}</td>
								<td className="px-4 py-2 text-center text-gray-200 tabular-nums">{o.games}</td>
								<td className="px-4 py-2 text-center text-gray-200 tabular-nums">{o.wins}</td>
								<td className="px-4 py-2 text-center text-gray-200 tabular-nums">
									{Math.round(o.wr * 100)}%
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
