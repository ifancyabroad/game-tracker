import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from "recharts";
import { ChartCard, ChartTooltip } from "common/components";
import { formatPct } from "common/utils/helpers";
import { STATS_THRESHOLDS, DISPLAY_LIMITS } from "common/utils/constants";
import { useGamePageStats } from "features/games/utils/hooks";

interface PlayerWinRateChartProps {
	gameId: string;
}

export const PlayerWinRateChart: React.FC<PlayerWinRateChartProps> = ({ gameId }) => {
	const { playerStats } = useGamePageStats(gameId);

	const chartData = playerStats
		.filter((p) => p.games >= STATS_THRESHOLDS.MIN_GAMES_FOR_BEST_GAME)
		.sort((a, b) => b.winRate - a.winRate)
		.slice(0, DISPLAY_LIMITS.CHARTS.MOST_PLAYED_GAMES);

	return (
		<ChartCard
			title="Player Win Rates (min 3 plays)"
			isEmpty={chartData.length === 0}
			emptyTitle="No player data"
			emptyDescription="Need at least 3 plays per player to show win rates"
		>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
					<XAxis
						dataKey="name"
						tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
						interval={0}
						angle={-15}
						dy={10}
					/>
					<YAxis
						domain={[0, 1]}
						tickFormatter={(v) => formatPct(v)}
						tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
						label={{
							value: "Win Rate",
							angle: -90,
							position: "center",
							style: { textAnchor: "middle" },
							fontSize: 12,
							dx: -20,
						}}
					/>
					<Tooltip
						cursor={{ fill: "var(--color-hover)" }}
						content={<ChartTooltip formatter={(v) => formatPct(v)} />}
					/>
					<Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
