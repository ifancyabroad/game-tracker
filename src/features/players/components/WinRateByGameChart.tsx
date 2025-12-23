import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from "recharts";
import { ChartCard, ChartTooltip } from "common/components";
import type { GameWinRateRow } from "features/players/types";
import { formatPct } from "common/utils/helpers";
import { STATS_THRESHOLDS } from "common/utils/constants";

interface RecentFormChartProps {
	gameWinRates: GameWinRateRow[];
}

export const WinRateByGameChart: React.FC<RecentFormChartProps> = ({ gameWinRates }) => {
	const chartData = gameWinRates
		.filter((g) => g.games >= STATS_THRESHOLDS.MIN_GAMES_FOR_BEST_GAME)
		.sort((a, b) => b.wr - a.wr)
		.slice(0, STATS_THRESHOLDS.MOST_PLAYED_GAMES_LIMIT);

	return (
		<ChartCard title="Win Rate by Game (min 3 plays)">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={chartData}>
					<CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
					<XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 12 }} interval={0} angle={-15} dy={10} />
					<YAxis
						domain={[0, 1]}
						tickFormatter={(v) => formatPct(v)}
						tick={{ fill: "#9CA3AF", fontSize: 12 }}
					/>
					<Tooltip
						cursor={{ fill: "rgba(255,255,255,0.05)" }}
						content={<ChartTooltip formatter={(v) => formatPct(v)} />}
					/>
					<Bar dataKey="wr">
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
