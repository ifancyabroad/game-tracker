import { useResults } from "features/events/context/ResultsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartCard } from "features/stats/components/ChartCard";
import { ChartTooltip } from "features/stats/components/ChartTooltip";
import { getColorForPlayer, getDisplayName } from "features/players/utils/helpers";

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
				const name = getDisplayName(player);
				const color = getColorForPlayer(player);
				return { name, winCount, color };
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
					<Bar dataKey="winCount" radius={[0, 4, 4, 0]}>
						{topWinningPlayers.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
