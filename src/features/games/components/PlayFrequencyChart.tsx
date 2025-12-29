import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ChartCard, ChartTooltip } from "common/components";
import { useGamePageStats } from "features/games/utils/hooks";
import { getColorForGame } from "features/games/utils/helpers";
import { useGames } from "features/games/context/GamesContext";

interface PlayFrequencyChartProps {
	gameId: string;
}

export const PlayFrequencyChart: React.FC<PlayFrequencyChartProps> = ({ gameId }) => {
	const { playFrequencySeries } = useGamePageStats(gameId);
	const { gameById } = useGames();
	const game = gameById.get(gameId);
	const color = getColorForGame(game);

	return (
		<ChartCard
			title="Play Frequency Over Time"
			isEmpty={playFrequencySeries.length === 0}
			emptyTitle="No play history"
			emptyDescription="Play this game to see frequency over time"
		>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={playFrequencySeries} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
					<XAxis
						dataKey="date"
						tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
						angle={-15}
						dy={10}
					/>
					<YAxis
						allowDecimals={false}
						tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
						label={{
							value: "Plays",
							angle: -90,
							position: "center",
							style: { textAnchor: "middle" },
							fontSize: 12,
							dx: -20,
						}}
					/>
					<Tooltip content={<ChartTooltip formatter={(v) => `${v} plays`} />} />
					<Line type="monotone" dataKey="plays" stroke={color} strokeWidth={2} dot={false} />
				</LineChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
