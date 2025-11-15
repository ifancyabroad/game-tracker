import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartCard } from "features/stats/components/ChartCard";
import { ChartTooltip } from "./ChartTooltip";
import type { PlayerStat } from "features/stats/utils/stats";

interface PlayerParticipationChartProps {
	overallStats: PlayerStat[];
}

export const PlayerParticipationChart: React.FC<PlayerParticipationChartProps> = ({ overallStats }) => {
	return (
		<ChartCard title="Player Participation">
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={overallStats}
						dataKey="participationCount"
						nameKey="name"
						cx="50%"
						cy="50%"
						outerRadius={100}
						fill="#8884d8"
						label={({ name }) => name}
					>
						{overallStats.map((player, index) => (
							<Cell key={`cell-${index}`} fill={player.color} />
						))}
					</Pie>
					<RechartsTooltip content={<ChartTooltip suffix="games" />} />
					<Legend wrapperStyle={{ fontSize: "12px", color: "#ccc" }} />
				</PieChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
