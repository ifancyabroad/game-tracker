import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { ChartCard, ChartTooltip } from "common/components";
import { DISPLAY_LIMITS } from "common/utils/constants";
import { usePlayerWinsOverTime } from "features/stats/utils/hooks";
import { usePlayerData } from "features/players/utils/hooks";

export const PlayerWinsOverTimeChart: React.FC = () => {
	const playerWinsOverTime = usePlayerWinsOverTime();
	const overallStats = usePlayerData();
	const playerData = overallStats
		.filter((p) => p.data.wins > 0)
		.sort((a, b) => b.data.wins - a.data.wins)
		.slice(0, DISPLAY_LIMITS.CHARTS.TOP_PLAYERS_OVER_TIME);

	return (
		<ChartCard
			title="Player Wins Over Time"
			icon={TrendingUp}
			isEmpty={playerWinsOverTime.length === 0}
			emptyTitle="No win data available"
			emptyDescription="Play some games to see player wins over time"
		>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={playerWinsOverTime} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
					<XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
					<YAxis
						allowDecimals={false}
						tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
						label={{
							value: "Total Wins",
							angle: -90,
							position: "center",
							style: { textAnchor: "middle" },
							fontSize: 12,
							dx: -20,
						}}
					/>
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
							activeDot={{ r: 6 }}
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
