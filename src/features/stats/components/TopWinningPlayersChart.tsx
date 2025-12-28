import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { Award } from "lucide-react";
import { ChartCard, ChartTooltip } from "common/components";
import type { PlayerWithData } from "features/players/types";

interface TopWinningPlayersChartProps {
	overallStats: PlayerWithData[];
}

export const TopWinningPlayersChart: React.FC<TopWinningPlayersChartProps> = ({ overallStats }) => {
	const chartData = overallStats
		.filter((p) => p.data.wins > 0)
		.sort((a, b) => b.data.wins - a.data.wins)
		.slice(0, 8);

	return (
		<ChartCard title="Top Winning Players" icon={Award}>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart layout="vertical" data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
					<XAxis
						type="number"
						allowDecimals={false}
						tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
					/>
					<YAxis
						type="category"
						dataKey="data.name"
						tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
					/>
					<Tooltip
						cursor={{ fill: "var(--color-hover)" }}
						content={<ChartTooltip formatter={(v) => `${v} wins`} />}
					/>
					<Bar dataKey="data.wins" radius={[0, 4, 4, 0]}>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.data.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
