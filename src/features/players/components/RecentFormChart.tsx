import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { ChartCard, ChartTooltip } from "common/components";
import { usePlayerPageStats } from "features/players/utils/hooks";
import { usePlayers } from "features/players/context/PlayersContext";
import { getColorForPlayer } from "features/players/utils/helpers";

interface RecentFormChartProps {
	playerId: string;
}

export const RecentFormChart: React.FC<RecentFormChartProps> = ({ playerId }) => {
	const { lastGamesSeries } = usePlayerPageStats(playerId);
	const { playerById } = usePlayers();
	const player = playerById.get(playerId);
	const color = getColorForPlayer(player);

	return (
		<ChartCard
			title="Recent Form (last 20 games)"
			icon={TrendingUp}
			iconColor={color}
			isEmpty={lastGamesSeries.length === 0}
			emptyTitle="No recent games"
			emptyDescription="Play at least one game to see recent form"
		>
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
					<Tooltip
						content={<ChartTooltip formatter={(v) => `${v}%`} labelFormatter={(v) => `Game ${v}`} />}
					/>
					<Line type="monotone" dataKey="wr" stroke={color} strokeWidth={2} dot={false} />
				</LineChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
