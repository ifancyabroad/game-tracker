import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
import { ChartCard } from "common/components/ChartCard";
import { ChartTooltip } from "common/components/ChartTooltip";
import type { IPlayer } from "features/players/types";

interface RecentFormChartProps {
	player: IPlayer;
	rankCounts: Array<{ rank: number; count: number }>;
}

export const RankDistributionChart: React.FC<RecentFormChartProps> = ({ player, rankCounts }) => (
	<ChartCard title="Rank Distribution">
		<ResponsiveContainer width="100%" height="100%">
			<BarChart data={rankCounts}>
				<CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
				<XAxis
					dataKey="rank"
					tick={{ fill: "#9CA3AF", fontSize: 12 }}
					label={{
						value: "Rank",
						position: "insideBottom",
						offset: -5,
						fill: "#9CA3AF",
						fontSize: 12,
					}}
				/>
				<YAxis
					allowDecimals={false}
					tick={{ fill: "#9CA3AF", fontSize: 12 }}
					label={{
						value: "Count",
						angle: -90,
						position: "insideLeft",
						fill: "#9CA3AF",
						fontSize: 12,
					}}
				/>
				<Tooltip content={<ChartTooltip labelFormatter={(v) => `Rank ${v}`} />} />
				<Bar dataKey="count" fill={player.color} />
			</BarChart>
		</ResponsiveContainer>
	</ChartCard>
);
