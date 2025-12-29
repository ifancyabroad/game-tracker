import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { ChartCard, ChartTooltip } from "common/components";
import { DISPLAY_LIMITS } from "common/utils/constants";
import { usePlayerData } from "features/players/utils/hooks";

export const PlayerWinRateChart: React.FC = () => {
	const overallStats = usePlayerData();
	const chartData = overallStats
		.filter((p) => p.data.wins > 0)
		.sort((a, b) => b.data.winRatePercent - a.data.winRatePercent)
		.slice(0, DISPLAY_LIMITS.CHARTS.PLAYER_WIN_RATES);

	return (
		<ChartCard
			title="Player Win Rates"
			isEmpty={chartData.length === 0}
			emptyTitle="No win rate data available"
			emptyDescription="Players need at least one win to appear here"
		>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
					<XAxis
						type="number"
						domain={[0, 100]}
						tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
						unit="%"
					/>
					<YAxis
						type="category"
						dataKey="data.name"
						tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
					/>
					<Tooltip
						cursor={{ fill: "var(--color-hover)" }}
						content={<ChartTooltip formatter={(v) => `${v}%`} />}
					/>
					<Bar dataKey="data.winRatePercent" radius={[0, 4, 4, 0]}>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.data.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
