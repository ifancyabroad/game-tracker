import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartCard } from "features/stats/components/ChartCard";
import { ChartTooltip } from "features/stats/components/ChartTooltip";
import type { PlayerWithData } from "features/players/utils/stats";

interface TopWinningPlayersChartProps {
	overallStats: PlayerWithData[];
}

export const TopWinningPlayersChart: React.FC<TopWinningPlayersChartProps> = ({ overallStats }) => (
	<ChartCard title="Top Winning Players">
		<ResponsiveContainer width="100%" height="100%">
			<BarChart layout="vertical" data={overallStats} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
				<XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#ccc" }} />
				<YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#ccc" }} />
				<Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} content={<ChartTooltip suffix="wins" />} />
				<Bar dataKey="data.winCount" radius={[0, 4, 4, 0]}>
					{overallStats.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={entry.color} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	</ChartCard>
);
