import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { ChartCard, ChartTooltip } from "common/components";
import { useIsMobile } from "common/utils/hooks";
import type { IPlayer, GameWinRateRow } from "features/players/types";

interface PointsByGameChartProps {
	player: IPlayer;
	gameWinRates: GameWinRateRow[];
}

export const PointsByGameChart: React.FC<PointsByGameChartProps> = ({ player, gameWinRates }) => {
	const isMobile = useIsMobile();
	const chartData = gameWinRates
		.filter((g) => g.points > 0)
		.sort((a, b) => b.points - a.points)
		.slice(0, 8);

	return (
		<ChartCard
			title="Points by Game"
			icon={PieChartIcon}
			iconColor={player.color}
			isEmpty={chartData.length === 0}
			emptyTitle="No points earned yet"
			emptyDescription="Win some games to earn points"
		>
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
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Pie>
					<Tooltip content={<ChartTooltip formatter={(v) => `${v} points`} />} />
					{isMobile && (
						<Legend
							wrapperStyle={{ fontSize: "12px", color: "var(--color-text-secondary)" }}
							iconType="circle"
						/>
					)}
				</PieChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
