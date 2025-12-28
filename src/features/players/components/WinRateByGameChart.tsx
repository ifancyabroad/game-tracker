import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from "recharts";
import { Percent } from "lucide-react";
import { ChartCard, ChartTooltip } from "common/components";
import type { IPlayer, GameWinRateRow } from "features/players/types";
import { formatPct } from "common/utils/helpers";
import { STATS_THRESHOLDS } from "common/utils/constants";

interface RecentFormChartProps {
	player: IPlayer;
	gameWinRates: GameWinRateRow[];
}

export const WinRateByGameChart: React.FC<RecentFormChartProps> = ({ player, gameWinRates }) => {
	const chartData = gameWinRates
		.filter((g) => g.games >= STATS_THRESHOLDS.MIN_GAMES_FOR_BEST_GAME)
		.sort((a, b) => b.wr - a.wr)
		.slice(0, STATS_THRESHOLDS.MOST_PLAYED_GAMES_LIMIT);

	return (
		<ChartCard title="Win Rate by Game (min 3 plays)" icon={Percent} iconColor={player.color}>
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
