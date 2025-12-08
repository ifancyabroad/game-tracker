import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartCard } from "common/components/ChartCard";
import { ChartTooltip } from "common/components/ChartTooltip";
import { useIsMobile } from "common/utils/hooks";
import type { IPlayer } from "features/players/types";
import type { GameWinRateRow } from "features/players/utils/stats";

interface PointsByGameChartProps {
	player: IPlayer;
	gameWinRates: GameWinRateRow[];
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

export const PointsByGameChart: React.FC<PointsByGameChartProps> = ({ player, gameWinRates }) => {
	const isMobile = useIsMobile();
	const chartData = gameWinRates
		.filter((g) => g.points > 0)
		.sort((a, b) => b.points - a.points)
		.slice(0, 8);

	const colors = generateColors(player.color, chartData.length);

	return (
		<ChartCard title="Points by Game">
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={chartData}
						cx="50%"
						cy="50%"
						labelLine={false}
						label={
							isMobile
								? false
								: ({ name, percent }) =>
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
					<Tooltip content={<ChartTooltip formatter={(v) => `${v} points`} />} />
					{isMobile && <Legend wrapperStyle={{ fontSize: "12px", color: "#ccc" }} iconType="circle" />}
				</PieChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
