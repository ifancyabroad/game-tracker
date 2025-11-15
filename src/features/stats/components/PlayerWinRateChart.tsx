import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartCard } from "features/stats/components/ChartCard";
import { ChartTooltip } from "features/stats/components/ChartTooltip";
import type { PlayerStats } from "features/players/utils/stats";

interface PlayerWinRateChartProps {
	overallStats: PlayerStats[];
}

export const PlayerWinRateChart: React.FC<PlayerWinRateChartProps> = ({ overallStats }) => {
	const chartData = overallStats.sort((a, b) => b.winRatePercent - a.winRatePercent);

	return (
		<ChartCard title="Player Win Rates">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
					<XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#ccc" }} unit="%" />
					<YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#ccc" }} />
					<Tooltip content={<ChartTooltip suffix="%" />} />
					<Bar dataKey="winRatePercent" radius={[0, 4, 4, 0]}>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
