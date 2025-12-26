import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from "recharts";
import { ChartCard, ChartTooltip } from "common/components";
import type { PlayerGameStats } from "features/games/types";
import { formatPct } from "common/utils/helpers";
import { STATS_THRESHOLDS } from "common/utils/constants";

interface PlayerWinRateChartProps {
	playerStats: PlayerGameStats[];
}

export const PlayerWinRateChart: React.FC<PlayerWinRateChartProps> = ({ playerStats }) => {
	const chartData = playerStats
		.filter((p) => p.games >= STATS_THRESHOLDS.MIN_GAMES_FOR_BEST_GAME)
		.sort((a, b) => b.winRate - a.winRate)
		.slice(0, STATS_THRESHOLDS.MOST_PLAYED_GAMES_LIMIT);

	return (
		<ChartCard title="Player Win Rates (min 3 plays)">
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
						cursor={{ fill: "var(--color-hover)" }}
						content={<ChartTooltip formatter={(v) => formatPct(v)} />}
					/>
					<Bar dataKey="winRate">
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
