import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from "recharts";
import { Percent } from "lucide-react";
import { ChartCard, ChartTooltip } from "common/components";
import { formatPct } from "common/utils/helpers";
import { STATS_THRESHOLDS, DISPLAY_LIMITS } from "common/utils/constants";
import { usePlayerPageStats } from "features/players/utils/hooks";
import { usePlayers } from "features/players/context/PlayersContext";
import { getColorForPlayer } from "features/players/utils/helpers";

interface WinRateByGameChartProps {
	playerId: string;
}

export const WinRateByGameChart: React.FC<WinRateByGameChartProps> = ({ playerId }) => {
	const { gameWinRates } = usePlayerPageStats(playerId);
	const { playerById } = usePlayers();
	const player = playerById.get(playerId);
	const color = getColorForPlayer(player);
	const chartData = gameWinRates
		.filter((g) => g.games >= STATS_THRESHOLDS.MIN_GAMES_FOR_BEST_GAME)
		.sort((a, b) => b.wr - a.wr)
		.slice(0, DISPLAY_LIMITS.CHARTS.MOST_PLAYED_GAMES);

	return (
		<ChartCard
			title="Win Rate by Game (min 3 plays)"
			icon={Percent}
			iconColor={color}
			isEmpty={chartData.length === 0}
			emptyTitle="No win rate data"
			emptyDescription="Play at least 3 games of the same type to see win rates"
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
					<Bar dataKey="wr" radius={[4, 4, 0, 0]}>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
