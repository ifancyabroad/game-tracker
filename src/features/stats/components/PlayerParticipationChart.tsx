import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartCard } from "common/components/ChartCard";
import { ChartTooltip } from "common/components/ChartTooltip";
import type { PlayerWithData } from "features/players/utils/stats";

interface PlayerParticipationChartProps {
	overallStats: PlayerWithData[];
}

export const PlayerParticipationChart: React.FC<PlayerParticipationChartProps> = ({ overallStats }) => (
	<ChartCard title="Player Participation">
		<ResponsiveContainer width="100%" height="100%">
			<PieChart>
				<Pie
					data={overallStats}
					dataKey="data.games"
					nameKey="data.name"
					cx="50%"
					cy="50%"
					outerRadius={100}
					fill="#8884d8"
					label={({ name }) => name}
				>
					{overallStats.map((player, index) => (
						<Cell key={`cell-${index}`} fill={player.data.color} />
					))}
				</Pie>
				<RechartsTooltip content={<ChartTooltip formatter={(v) => `${v} games`} />} />
				<Legend wrapperStyle={{ fontSize: "12px", color: "#ccc" }} />
			</PieChart>
		</ResponsiveContainer>
	</ChartCard>
);
