import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import { useResults } from "features/events/context/ResultsContext";
import { useEvents } from "features/events/context/EventsContext";
import { useGames } from "features/games/context/GamesContext";
import { ChartCard } from "features/stats/components/ChartCard";
import { ChartTooltip } from "features/stats/components/ChartTooltip";

export const GameTrendsChart: React.FC = () => {
	const { results } = useResults();
	const { events } = useEvents();
	const { games } = useGames();

	const data = useMemo(() => {
		const dateMap: Record<string, Record<string, number>> = {};

		results.forEach((result) => {
			const event = events.find((e) => e.id === result.eventId);
			if (!event) return;

			const game = games.find((g) => g.id === result.gameId);
			if (!game) return;

			const formattedDate = format(parseISO(event.date), "MMM d");

			if (!dateMap[formattedDate]) {
				dateMap[formattedDate] = {};
			}
			if (!dateMap[formattedDate][game.name]) {
				dateMap[formattedDate][game.name] = 0;
			}
			dateMap[formattedDate][game.name] += 1;
		});

		// Convert to array format sorted by date
		return Object.entries(dateMap)
			.map(([date, counts]) => ({ date, ...counts }))
			.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
	}, [results, events, games]);

	const gameNames = useMemo(() => {
		const uniqueNames = new Set(results.map((r) => games.find((g) => g.id === r.gameId)?.name).filter(Boolean));
		return Array.from(uniqueNames) as string[];
	}, [results, games]);

	return (
		<ChartCard title="Game Trends Over Time">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
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
