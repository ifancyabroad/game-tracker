import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { ChartCard, ChartTooltip, EmptyState } from "common/components";
import { Trophy } from "lucide-react";
import type { GamePointsData } from "features/stats/utils/calculations/gamePoints";

interface GamePointsChartProps {
	gamePoints: GamePointsData[];
}

export const GamePointsChart: React.FC<GamePointsChartProps> = ({ gamePoints }) => {
	// Show top 10 games by points
	const topGames = gamePoints.slice(0, 10);

	if (topGames.length === 0) {
		return (
			<ChartCard title="Top Games by Points">
				<EmptyState>
					<Trophy size={32} className="mx-auto mb-2 text-[var(--color-text-secondary)]" />
					<p>No game points data available</p>
					<p className="text-xs">Play some games to see point totals</p>
				</EmptyState>
			</ChartCard>
		);
	}

	return (
		<ChartCard title="Top Games by Points" subtitle="Total points awarded from each game across all plays">
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={topGames} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
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
						content={<ChartTooltip />}
						formatter={(value: number) => `${value} points`}
					/>
					<Bar dataKey="totalPoints" radius={[4, 4, 0, 0]}>
						{topGames.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
