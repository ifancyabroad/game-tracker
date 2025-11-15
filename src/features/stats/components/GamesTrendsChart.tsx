import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useMemo } from "react";
import { useResults } from "features/events/context/ResultsContext";
import { useGames } from "features/games/context/GamesContext";
import { ChartCard } from "features/stats/components/ChartCard";
import { ChartTooltip } from "features/stats/components/ChartTooltip";
import type { TimeSeriesData } from "features/stats/utils/stats";

interface GameTrendsChartProps {
	gameTrends: TimeSeriesData[];
}

export const GameTrendsChart: React.FC<GameTrendsChartProps> = ({ gameTrends }) => {
	const { results } = useResults();
	const { games } = useGames();

	const gameNames = useMemo(() => {
		const uniqueNames = new Set(results.map((r) => games.find((g) => g.id === r.gameId)?.name).filter(Boolean));
		return Array.from(uniqueNames) as string[];
	}, [results, games]);

	return (
		<ChartCard title="Game Trends Over Time">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={gameTrends} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
					<XAxis dataKey="date" tick={{ fontSize: 12, fill: "#ccc" }} />
					<YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#ccc" }} />
					<Tooltip content={<ChartTooltip suffix="plays" />} />
					<Legend wrapperStyle={{ fontSize: "12px", color: "#ccc" }} />
					{gameNames.map((name, index) => (
						<Line
							key={name}
							type="monotone"
							dataKey={name}
							stroke={`hsl(${(index * 67) % 360}, 70%, 60%)`}
							strokeWidth={2}
							dot={false}
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
