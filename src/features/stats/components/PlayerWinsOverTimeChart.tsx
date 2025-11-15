import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useMemo } from "react";
import { useResults } from "features/events/context/ResultsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { ChartCard } from "features/stats/components/ChartCard";
import { ChartTooltip } from "features/stats/components/ChartTooltip";
import { getColorForPlayer, getDisplayName } from "features/players/utils/helpers";
import type { TimeSeriesData } from "features/stats/utils/stats";

interface PlayerWinsOverTimeChartProps {
	playerTrends: TimeSeriesData[];
}

export const PlayerWinsOverTimeChart: React.FC<PlayerWinsOverTimeChartProps> = ({ playerTrends }) => {
	const { results } = useResults();
	const { playerById } = usePlayers();

	const playerData = useMemo(() => {
		const ids = new Set(results.flatMap((r) => r.playerResults.map((pr) => pr.playerId)));
		return Array.from(ids)
			.map((id) => playerById.get(id))
			.filter((player): player is NonNullable<typeof player> => Boolean(player))
			.map((player) => ({
				name: getDisplayName(player),
				color: getColorForPlayer(player),
			}));
	}, [results, playerById]);

	return (
		<ChartCard title="Player Wins Over Time">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={playerTrends} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
					<XAxis dataKey="date" tick={{ fontSize: 12, fill: "#ccc" }} />
					<YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#ccc" }} />
					<Tooltip content={<ChartTooltip suffix="wins" />} />
					<Legend wrapperStyle={{ fontSize: "12px", color: "#ccc" }} />
					{playerData.map((player) => (
						<Line
							key={player.name}
							type="monotone"
							dataKey={player.name}
							stroke={player.color}
							strokeWidth={2}
							dot={false}
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
