import { useResults } from "features/events/context/ResultsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "features/stats/components/ChartCard";
import { ChartTooltip } from "features/stats/components/ChartTooltip";

export const TopWinningPlayersChart: React.FC = () => {
	const { results } = useResults();
	const { players } = usePlayers();

	const topWinningPlayers = useMemo(() => {
		const playerWinCounts: Record<string, number> = {};

		results.forEach((result) => {
			result.playerResults.forEach((pr) => {
				if (pr.isWinner || pr.rank === 1) {
					playerWinCounts[pr.playerId] = (playerWinCounts[pr.playerId] || 0) + 1;
				}
			});
		});

		return Object.entries(playerWinCounts)
			.map(([playerId, winCount]) => {
				const player = players.find((p) => p.id === playerId);
				const name = player?.preferredName || `${player?.firstName} ${player?.lastName}`;
				return { name, winCount };
			})
			.filter((p) => !!p.name)
			.sort((a, b) => b.winCount - a.winCount)
			.slice(0, 10); // top 10
	}, [results, players]);

	return (
		<ChartCard title="Top Winning Players">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					layout="vertical"
					data={topWinningPlayers}
					margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
				>
					<XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#ccc" }} />
					<YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#ccc" }} />
					<Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} content={<ChartTooltip suffix="wins" />} />
					<Bar dataKey="winCount" fill="#F59E0B" radius={[0, 4, 4, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
