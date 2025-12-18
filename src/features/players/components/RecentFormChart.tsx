import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ChartCard, ChartTooltip } from "common/components";
import type { IPlayer } from "features/players/types";

interface RecentFormChartProps {
	player: IPlayer;
	lastGamesSeries: Array<{ x: number; wr: number }>;
}

export const RecentFormChart: React.FC<RecentFormChartProps> = ({ player, lastGamesSeries }) => (
	<ChartCard title="Recent Form (last 20 games)">
		<ResponsiveContainer width="100%" height="100%">
			<LineChart data={lastGamesSeries}>
				<CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
				<XAxis
					dataKey="x"
					tick={{ fill: "#9CA3AF", fontSize: 12 }}
					label={{
						value: "Game",
						position: "insideBottom",
						offset: -5,
						fill: "#9CA3AF",
						fontSize: 12,
					}}
				/>
				<YAxis
					domain={[0, 100]}
					tick={{ fill: "#9CA3AF", fontSize: 12 }}
					label={{
						value: "Win Rate",
						angle: -90,
						position: "insideLeft",
						fill: "#9CA3AF",
						fontSize: 12,
					}}
				/>
				<Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} labelFormatter={(v) => `Game ${v}`} />} />
				<Line type="monotone" dataKey="wr" stroke={player.color} strokeWidth={2} dot={false} />
			</LineChart>
		</ResponsiveContainer>
	</ChartCard>
);
