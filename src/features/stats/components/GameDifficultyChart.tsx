import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { ChartCard, ChartTooltip, EmptyState } from "common/components";
import { Trophy } from "lucide-react";
import type { GameDifficulty } from "features/stats/utils/calculations/gameDifficulty";

interface GameDifficultyChartProps {
	difficulties: GameDifficulty[];
}

export const GameDifficultyChart: React.FC<GameDifficultyChartProps> = ({ difficulties }) => {
	if (difficulties.length === 0) {
		return (
			<ChartCard title="Game Competitiveness">
				<EmptyState>
					<Trophy size={32} className="mx-auto mb-2 text-[var(--color-text-secondary)]" />
					<p>No competitiveness data available</p>
					<p className="text-xs">Games need at least 3 plays to calculate competitiveness</p>
				</EmptyState>
			</ChartCard>
		);
	}

	return (
		<ChartCard title="Game Competitiveness" subtitle="Shows how evenly wins are distributed across players">
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={difficulties} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
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
						domain={[0, 100]}
						tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
						tickFormatter={(value) => `${value}%`}
						label={{
							value: "Competitiveness Score",
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
						formatter={(value: number) => `${value}%`}
					/>
					<Bar dataKey="difficultyScore" radius={[4, 4, 0, 0]}>
						{difficulties.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
