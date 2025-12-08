import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
import { ChartCard } from "common/components/ChartCard";
import { ChartTooltip } from "common/components/ChartTooltip";
import type { IPlayer } from "features/players/types";
import type { GameWinRateRow } from "features/players/utils/stats";

interface RecentFormChartProps {
	player: IPlayer;
	gameWinRates: GameWinRateRow[];
}

export const WinRateByGameChart: React.FC<RecentFormChartProps> = ({ player, gameWinRates }) => (
	<ChartCard title="Win Rate by Game (min 3 plays)">
		<ResponsiveContainer width="100%" height="100%">
			<BarChart
				data={gameWinRates
					.filter((g) => g.games >= 3)
					.sort((a, b) => b.wr - a.wr)
					.slice(0, 8)}
			>
				<CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
				<XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 12 }} interval={0} angle={-15} dy={10} />
				<YAxis
					domain={[0, 1]}
					tickFormatter={(v) => `${Math.round(v * 100)}%`}
					tick={{ fill: "#9CA3AF", fontSize: 12 }}
				/>
				<Tooltip
					cursor={{ fill: "rgba(255,255,255,0.05)" }}
					content={<ChartTooltip formatter={(v) => `${Math.round(v * 100)}%`} />}
				/>
				<Bar dataKey="wr" fill={player.color} />
			</BarChart>
		</ResponsiveContainer>
	</ChartCard>
);
