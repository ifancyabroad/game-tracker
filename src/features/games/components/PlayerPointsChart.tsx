import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "features/stats/components/ChartCard";
import type { PlayerGameStats } from "features/games/utils/stats";

interface PlayerPointsChartProps {
	playerStats: PlayerGameStats[];
	gameColor?: string;
}

const generateColors = (baseColor: string, count: number) => {
	const opacities = [1, 0.8, 0.65, 0.5, 0.4, 0.3, 0.25, 0.2];

	return Array.from({ length: count }, (_, i) => {
		const opacity = opacities[i % opacities.length];
		return (
			baseColor +
			Math.round(opacity * 255)
				.toString(16)
				.padStart(2, "0")
		);
	});
};

export const PlayerPointsChart: React.FC<PlayerPointsChartProps> = ({ playerStats, gameColor = "#3b82f6" }) => {
	const chartData = playerStats
		.filter((p) => p.points > 0)
		.sort((a, b) => b.points - a.points)
		.slice(0, 8);

	const colors = generateColors(gameColor, chartData.length);

	return (
		<ChartCard title="Points by Player">
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={chartData}
						cx="50%"
						cy="50%"
						labelLine={false}
						label={({ name, percent }) =>
							percent && percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
						}
						outerRadius={100}
						fill="#8884d8"
						dataKey="points"
					>
						{chartData.map((_, index) => (
							<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
						))}
					</Pie>
					<Tooltip
						contentStyle={{
							background: "var(--color-surface)",
							border: "1px solid #334155",
							color: "#E5E7EB",
						}}
						formatter={(value: number) => [value, "Points"]}
					/>
				</PieChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
