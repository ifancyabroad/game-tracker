import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { usePlayers } from "features/players/context/PlayersContext";
import { useResults } from "features/events/context/ResultsContext";
import { ChartCard } from "features/stats/components/ChartCard";
import { ChartTooltip } from "features/stats/components/ChartTooltip";
import { getDisplayName } from "features/players/utils/helpers";

export const PlayerWinRateChart: React.FC = () => {
	const { players } = usePlayers();
	const { results } = useResults();

	const data = useMemo(() => {
		const winMap: Record<string, { wins: number; total: number }> = {};

		results.forEach((result) => {
			result.playerResults.forEach((pr) => {
				if (!winMap[pr.playerId]) {
					winMap[pr.playerId] = { wins: 0, total: 0 };
				}
				winMap[pr.playerId].total += 1;
				if (pr.isWinner || pr.rank === 1) {
					winMap[pr.playerId].wins += 1;
				}
			});
		});

		return players
			.map((player) => {
				const stats = winMap[player.id];
				const percentage = stats && stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;
				const name = getDisplayName(player);
				return { name, winRate: percentage };
			})
			.sort((a, b) => b.winRate - a.winRate);
	}, [players, results]);

	return (
		<ChartCard title="Player Win Rates">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
					<XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#ccc" }} unit="%" />
					<YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#ccc" }} />
					<Tooltip content={<ChartTooltip suffix="%" />} />
					<Bar dataKey="winRate" fill="#3B82F6" radius={[0, 4, 4, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
