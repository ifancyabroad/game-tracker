import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { BarChart3 } from "lucide-react";
import { ChartCard, ChartTooltip } from "common/components";
import { DISPLAY_LIMITS } from "common/utils/constants";
import type { GamePointsData } from "features/stats/utils/calculations/gamePoints";

interface GamePointsChartProps {
	gamePoints: GamePointsData[];
}

export const GamePointsChart: React.FC<GamePointsChartProps> = ({ gamePoints }) => {
	const chartData = gamePoints.slice(0, DISPLAY_LIMITS.CHARTS.GAME_POINTS);
	return (
		<ChartCard
			title="Top Games by Points"
			icon={BarChart3}
			isEmpty={chartData.length === 0}
			emptyTitle="No game points data available"
			emptyDescription="Play some games to see point totals"
		>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
					<XAxis
						dataKey="gameName"
						interval={0}
						tick={({ x, y, payload }) => (
							<g transform={`translate(${x},${y})`}>
								<text
									transform="rotate(-30)"
									textAnchor="end"
									fill="var(--color-text-secondary)"
									fontSize={12}
									dy={10}
								>
									{payload.value}
								</text>
							</g>
						)}
					/>
					<YAxis
						tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
						label={{
							value: "Total Points",
							angle: -90,
							position: "center",
							style: { textAnchor: "middle" },
							fontSize: 12,
							dx: -20,
						}}
					/>
					<Tooltip
						cursor={{ fill: "var(--color-hover)" }}
						content={<ChartTooltip formatter={(value: number) => `${value} points`} />}
					/>
					<Bar dataKey="totalPoints" radius={[4, 4, 0, 0]}>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
