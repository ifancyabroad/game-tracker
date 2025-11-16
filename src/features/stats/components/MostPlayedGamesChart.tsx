import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "common/components/ChartCard";
import { ChartTooltip } from "common/components/ChartTooltip";
import type { MostPlayedGames } from "features/stats/utils/stats";

interface MostPlayedGamesChartProps {
	mostPlayedGames: MostPlayedGames[];
}

export const MostPlayedGamesChart: React.FC<MostPlayedGamesChartProps> = ({ mostPlayedGames }) => (
	<ChartCard title="Most Played Games">
		<ResponsiveContainer width="100%" height={300}>
			<BarChart data={mostPlayedGames} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
				<XAxis
					dataKey="name"
					interval={0}
					tick={({ x, y, payload }) => (
						<g transform={`translate(${x},${y})`}>
							<text transform="rotate(-30)" textAnchor="end" fill="#ccc" fontSize={12} dy={10}>
								{payload.value}
							</text>
						</g>
					)}
				/>
				<YAxis tick={{ fontSize: 12, fill: "#ccc" }} allowDecimals={false} />
				<Tooltip content={<ChartTooltip formatter={(v) => `${v} plays`} />} />
				<Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#4F46E5" />
			</BarChart>
		</ResponsiveContainer>
	</ChartCard>
);
