import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { ChartCard, ChartTooltip } from "common/components";
import type { IPlayer } from "features/players/types";

interface RecentFormChartProps {
	player: IPlayer;
	lastGamesSeries: Array<{ x: number; wr: number }>;
}

export const RecentFormChart: React.FC<RecentFormChartProps> = ({ player, lastGamesSeries }) => (
	<ChartCard title="Recent Form (last 20 games)" icon={TrendingUp} iconColor={player.color}>
		<ResponsiveContainer width="100%" height="100%">
			<LineChart data={lastGamesSeries} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
				<CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
				<XAxis
					dataKey="x"
					tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
					label={{
						value: "Game",
						position: "insideBottom",
						offset: -5,
						fill: "var(--color-text-secondary)",
						fontSize: 12,
					}}
				/>
				<YAxis
					domain={[0, 100]}
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
				<Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} labelFormatter={(v) => `Game ${v}`} />} />
				<Line type="monotone" dataKey="wr" stroke={player.color} strokeWidth={2} dot={false} />
			</LineChart>
		</ResponsiveContainer>
	</ChartCard>
);
