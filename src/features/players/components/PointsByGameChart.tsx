import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { ChartCard, ChartTooltip } from "common/components";
import { useIsMobile } from "common/utils/hooks";
import { DISPLAY_LIMITS } from "common/utils/constants";
import { usePlayerPageStats } from "features/players/utils/hooks";
import { usePlayers } from "features/players/context/PlayersContext";
import { getColorForPlayer } from "features/players/utils/helpers";

interface PointsByGameChartProps {
	playerId: string;
}

export const PointsByGameChart: React.FC<PointsByGameChartProps> = ({ playerId }) => {
	const isMobile = useIsMobile();
	const { gameWinRates } = usePlayerPageStats(playerId);
	const { playerById } = usePlayers();
	const player = playerById.get(playerId);
	const color = getColorForPlayer(player);

	const chartData = gameWinRates
		.filter((g) => g.points > 0)
		.sort((a, b) => b.points - a.points)
		.slice(0, DISPLAY_LIMITS.CHARTS.POINTS_BY_GAME_PIE);

	return (
		<ChartCard
			title="Points by Game"
			icon={PieChartIcon}
			iconColor={color}
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
