import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { usePlayers } from "features/players/context/PlayersContext";
import { ChartCard } from "features/stats/components/ChartCard";
import { useResults } from "features/events/context/ResultsContext";
import { ChartTooltip } from "./ChartTooltip";

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
			const name = player?.preferredName || `${player?.firstName} ${player?.lastName}`;
			return {
				name,
				value: count,
			};
		});
	}, [results, players]);

	const COLORS = [
		"#6366F1",
		"#10B981",
		"#F59E0B",
		"#EF4444",
		"#8B5CF6",
		"#EC4899",
		"#F43F5E",
		"#14B8A6",
		"#A855F7",
		"#EAB308",
	];

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
						{playerParticipationData.map((_, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
						))}
					</Pie>
					<RechartsTooltip content={<ChartTooltip suffix="games" />} />
					<Legend wrapperStyle={{ fontSize: "12px", color: "#ccc" }} />
				</PieChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
