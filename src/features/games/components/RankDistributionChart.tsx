import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ChartCard } from "features/stats/components/ChartCard";

interface RankDistributionChartProps {
	rankDistribution: Array<{ rank: number; count: number }>;
	gameColor?: string;
}

export const RankDistributionChart: React.FC<RankDistributionChartProps> = ({
	rankDistribution,
	gameColor = "#3b82f6",
}) => (
	<ChartCard title="Rank Distribution">
		<ResponsiveContainer width="100%" height="100%">
			<BarChart data={rankDistribution}>
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
					tick={{ fill: "#9CA3AF", fontSize: 12 }}
					label={{
						value: "Count",
						angle: -90,
						position: "insideLeft",
						fill: "#9CA3AF",
						fontSize: 12,
					}}
				/>
				<Tooltip
					contentStyle={{
						background: "var(--color-surface)",
						border: "1px solid #334155",
						color: "#E5E7EB",
					}}
					formatter={(v) => [v, "Count"]}
				/>
				<Bar dataKey="count" fill={gameColor} />
			</BarChart>
		</ResponsiveContainer>
	</ChartCard>
);
