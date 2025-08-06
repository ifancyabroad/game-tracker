import { useResults } from "features/events/context/ResultsContext";
import { useGames } from "features/games/context/GamesContext";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "features/stats/components/ChartCard";
import { ChartTooltip } from "features/stats/components/ChartTooltip";

export const MostPlayedGamesChart: React.FC = () => {
	const { games } = useGames();
	const { results } = useResults();

	const mostPlayedGames = useMemo(() => {
		const gameCount: Record<string, number> = {};
		results.forEach((r) => {
			gameCount[r.gameId] = (gameCount[r.gameId] || 0) + 1;
		});
		return Object.entries(gameCount)
			.map(([gameId, count]) => ({
				name: games.find((g) => g.id === gameId)?.name || "Unknown",
				count,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 8);
	}, [results, games]);

	return (
		<ChartCard title="Most Played Games">
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={mostPlayedGames} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
					<XAxis
						dataKey="name"
						interval={0}
						tick={({ x, y, payload }) => (
							<g transform={`translate(${x},${y})`}>
								<text transform="rotate(-30)" textAnchor="end" fill="#ccc" fontSize={12} dy={10}>
									{payload.value}
								</text>
							</g>
						)}
					/>
					<YAxis tick={{ fontSize: 12, fill: "#ccc" }} allowDecimals={false} />
					<Tooltip content={<ChartTooltip suffix="plays" />} />
					<Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#4F46E5" />
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
