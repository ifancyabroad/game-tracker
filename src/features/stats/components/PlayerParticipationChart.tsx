import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartCard, ChartTooltip } from "common/components";
import { useIsMobile } from "common/utils/hooks";
import { usePlayerData } from "features/players/utils/hooks";

export const PlayerParticipationChart: React.FC = () => {
	const overallStats = usePlayerData();
	const isMobile = useIsMobile();

	return (
		<ChartCard
			title="Player Participation"
			isEmpty={overallStats.length === 0}
			emptyTitle="No player data available"
			emptyDescription="Add some players and play games to see participation"
		>
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
						label={isMobile ? false : ({ name }) => name}
					>
						{overallStats.map((player, index) => (
							<Cell key={`cell-${index}`} fill={player.data.color} />
						))}
					</Pie>
					<RechartsTooltip content={<ChartTooltip formatter={(v) => `${v} games`} />} />
					{isMobile && (
						<Legend
							wrapperStyle={{ fontSize: "12px", color: "var(--color-text-secondary)" }}
							iconType="circle"
						/>
					)}
				</PieChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
