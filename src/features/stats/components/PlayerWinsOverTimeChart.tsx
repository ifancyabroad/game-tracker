import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartCard, ChartTooltip } from "common/components";
import type { TimeSeriesData } from "features/stats/utils/stats";
import type { PlayerWithData } from "features/players/utils/stats";

interface PlayerWinsOverTimeChartProps {
	overallStats: PlayerWithData[];
	playerWinsOverTime: TimeSeriesData[];
}

export const PlayerWinsOverTimeChart: React.FC<PlayerWinsOverTimeChartProps> = ({
	playerWinsOverTime,
	overallStats,
}) => {
	const playerData = overallStats.filter((p) => p.data.wins > 0);

	return (
		<ChartCard title="Player Wins Over Time">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={playerWinsOverTime} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
					<XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
					<YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
					<Tooltip content={<ChartTooltip formatter={(v) => `${v} wins`} />} />
					<Legend wrapperStyle={{ fontSize: "12px", color: "var(--color-text-secondary)" }} />
					{playerData.map((player) => (
						<Line
							key={player.id}
							type="monotone"
							dataKey={player.data.name}
							stroke={player.data.color}
							strokeWidth={2}
							dot={false}
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
