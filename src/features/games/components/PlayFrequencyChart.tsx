import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { ChartCard, ChartTooltip } from "common/components";
import type { GameWithData } from "features/games/types";

interface PlayFrequencyChartProps {
	game: GameWithData;
	playFrequencySeries: Array<{ date: string; plays: number }>;
}

export const PlayFrequencyChart: React.FC<PlayFrequencyChartProps> = ({ game, playFrequencySeries }) => (
	<ChartCard title="Play Frequency Over Time" icon={TrendingUp} iconColor={game.color}>
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
				<Line type="monotone" dataKey="plays" stroke={game.color} strokeWidth={2} dot={false} />
			</LineChart>
		</ResponsiveContainer>
	</ChartCard>
);
