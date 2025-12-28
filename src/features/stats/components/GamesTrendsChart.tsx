import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { useResults } from "features/events/context/ResultsContext";
import { useGames } from "features/games/context/GamesContext";
import { ChartCard, ChartTooltip } from "common/components";
import type { TimeSeriesData } from "features/stats/types";

interface GameTrendsChartProps {
	gameTrends: TimeSeriesData[];
}

export const GameTrendsChart: React.FC<GameTrendsChartProps> = ({ gameTrends }) => {
	const { results } = useResults();
	const { gameById } = useGames();

	const gameData = useMemo(() => {
		const gameCounts = new Map<string, { name: string; color: string; count: number }>();
		results.forEach((r) => {
			const game = gameById.get(r.gameId);
			if (game) {
				const existing = gameCounts.get(game.name);
				if (existing) {
					existing.count++;
				} else {
					gameCounts.set(game.name, { name: game.name, color: game.color, count: 1 });
				}
			}
		});
		return Array.from(gameCounts.values())
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);
	}, [results, gameById]);

	return (
		<ChartCard
			title="Game Trends Over Time"
			icon={TrendingUp}
			isEmpty={gameTrends.length === 0}
			emptyTitle="No game trends available"
			emptyDescription="Play some games to see trends over time"
		>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={gameTrends} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
					<XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
					<YAxis
						allowDecimals={false}
						tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
						label={{
							value: "Total Plays",
							angle: -90,
							position: "center",
							style: { textAnchor: "middle" },
							fontSize: 12,
							dx: -20,
						}}
					/>
					<Tooltip content={<ChartTooltip formatter={(v) => `${v} plays`} />} />
					<Legend wrapperStyle={{ fontSize: "12px", color: "var(--color-text-secondary)" }} />
					{gameData.map((game) => (
						<Line
							key={game.name}
							type="monotone"
							dataKey={game.name}
							stroke={game.color}
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
