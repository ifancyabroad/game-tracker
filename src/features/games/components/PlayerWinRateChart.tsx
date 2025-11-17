import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from "recharts";
import { ChartCard } from "common/components/ChartCard";
import { ChartTooltip } from "common/components/ChartTooltip";
import type { PlayerGameStats } from "features/games/utils/stats";

interface PlayerWinRateChartProps {
	playerStats: PlayerGameStats[];
}

export const PlayerWinRateChart: React.FC<PlayerWinRateChartProps> = ({ playerStats }) => {
	const chartData = playerStats
		.filter((p) => p.games >= 3)
		.sort((a, b) => b.winRate - a.winRate)
		.slice(0, 8);

	return (
		<ChartCard title="Player Win Rates (min 3 plays)">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={chartData}>
					<CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
					<XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 12 }} interval={0} angle={-15} dy={10} />
					<YAxis
						domain={[0, 1]}
						tickFormatter={(v) => `${Math.round(v * 100)}%`}
						tick={{ fill: "#9CA3AF", fontSize: 12 }}
					/>
					<Tooltip content={<ChartTooltip formatter={(v) => `${Math.round(v * 100)}%`} />} />
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
