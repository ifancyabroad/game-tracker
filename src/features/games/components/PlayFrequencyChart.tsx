import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ChartCard } from "common/components/ChartCard";
import { ChartTooltip } from "common/components/ChartTooltip";

interface PlayFrequencyChartProps {
	playFrequencySeries: Array<{ date: string; plays: number }>;
}

export const PlayFrequencyChart: React.FC<PlayFrequencyChartProps> = ({ playFrequencySeries }) => (
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
				<Tooltip content={<ChartTooltip formatter={(v) => `${v} plays`} />} />
				<Line type="monotone" dataKey="plays" stroke="var(--color-primary)" strokeWidth={2} dot={true} />
			</LineChart>
		</ResponsiveContainer>
	</ChartCard>
);
