import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { usePlayers } from "features/players/context/PlayersContext";
import { ChartCard } from "features/stats/components/ChartCard";
import { useResults } from "features/events/context/ResultsContext";
import { ChartTooltip } from "./ChartTooltip";
import { getColorForPlayer, getDisplayName } from "features/players/utils/helpers";

export const PlayerParticipationChart: React.FC = () => {
	const { results } = useResults();
	const { players } = usePlayers();

	const playerParticipationData = useMemo(() => {
		const counts: Record<string, number> = {};

		results.forEach((result) => {
			result.playerResults.forEach((pr) => {
				counts[pr.playerId] = (counts[pr.playerId] || 0) + 1;
			});
		});

		return Object.entries(counts).map(([playerId, count]) => {
			const player = players.find((p) => p.id === playerId);
			const name = getDisplayName(player);
			const color = getColorForPlayer(player);
			return {
				name,
				value: count,
				color,
			};
		});
	}, [results, players]);

	return (
		<ChartCard title="Player Participation">
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={playerParticipationData}
						dataKey="value"
						nameKey="name"
						cx="50%"
						cy="50%"
						outerRadius={100}
						fill="#8884d8"
						label={({ name }) => name}
					>
						{playerParticipationData.map((player, index) => (
							<Cell key={`cell-${index}`} fill={player.color} />
						))}
					</Pie>
					<RechartsTooltip content={<ChartTooltip suffix="games" />} />
					<Legend wrapperStyle={{ fontSize: "12px", color: "#ccc" }} />
				</PieChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
