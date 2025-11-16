import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ChartCard } from "features/stats/components/ChartCard";

interface PlayFrequencyChartProps {
	playFrequencySeries: Array<{ date: string; plays: number }>;
	gameColor?: string;
}

export const PlayFrequencyChart: React.FC<PlayFrequencyChartProps> = ({
	playFrequencySeries,
	gameColor = "#3b82f6",
}) => (
	<ChartCard title="Play Frequency Over Time">
		<ResponsiveContainer width="100%" height="100%">
			<LineChart data={playFrequencySeries}>
				<CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
				<XAxis dataKey="date" tick={{ fill: "#9CA3AF", fontSize: 12 }} angle={-15} dy={10} />
				<YAxis
					tick={{ fill: "#9CA3AF", fontSize: 12 }}
					label={{
						value: "Plays",
						angle: -90,
						position: "insideLeft",
						fill: "#9CA3AF",
						fontSize: 12,
					}}
				/>
				<Tooltip
					contentStyle={{
						background: "var(--color-surface)",
						border: "1px solid #334155",
						color: "#E5E7EB",
					}}
					labelFormatter={(v) => v}
					formatter={(v) => [v, "Plays"]}
				/>
				<Line type="monotone" dataKey="plays" stroke={gameColor} strokeWidth={2} dot={true} />
			</LineChart>
		</ResponsiveContainer>
	</ChartCard>
);
