import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useMemo } from "react";
import { useResults } from "features/events/context/ResultsContext";
import { useEvents } from "features/events/context/EventsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { ChartCard } from "features/stats/components/ChartCard";
import { ChartTooltip } from "features/stats/components/ChartTooltip";
import { format, parseISO } from "date-fns";
import { getDisplayName } from "features/players/utils/helpers";

export const PlayerWinsOverTimeChart: React.FC = () => {
	const { results } = useResults();
	const { events } = useEvents();
	const { players } = usePlayers();

	const data = useMemo(() => {
		const dateMap: Record<string, Record<string, number>> = {};
		const cumulativeWins: Record<string, number> = {};

		// Get events sorted by date
		const sortedEvents = events.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

		sortedEvents.forEach((event) => {
			const date = format(parseISO(event.date), "MMM d");
			if (!dateMap[date]) dateMap[date] = {};

			results
				.filter((r) => r.eventId === event.id)
				.forEach((result) => {
					result.playerResults.forEach((pr) => {
						if (pr.isWinner || pr.rank === 1) {
							if (!cumulativeWins[pr.playerId]) cumulativeWins[pr.playerId] = 0;
							cumulativeWins[pr.playerId] += 1;
						}
					});
				});

			// Snapshot current cumulative wins into the dateMap
			for (const playerId in cumulativeWins) {
				const player = players.find((p) => p.id === playerId);
				if (!player) continue;
				const name = getDisplayName(player);
				dateMap[date][name] = cumulativeWins[playerId];
			}
		});

		return Object.entries(dateMap)
			.map(([date, values]) => ({ date, ...values }))
			.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
	}, [results, events, players]);

	const playerNames = useMemo(() => {
		const ids = new Set(results.flatMap((r) => r.playerResults.map((pr) => pr.playerId)));
		return Array.from(ids)
			.map((id) => players.find((p) => p.id === id))
			.filter(Boolean)
			.map(getDisplayName);
	}, [results, players]);

	return (
		<ChartCard title="Player Wins Over Time">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
					<XAxis dataKey="date" tick={{ fontSize: 12, fill: "#ccc" }} />
					<YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#ccc" }} />
					<Tooltip content={<ChartTooltip suffix="wins" />} />
					<Legend wrapperStyle={{ fontSize: "12px", color: "#ccc" }} />
					{playerNames.map((name, index) => (
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
