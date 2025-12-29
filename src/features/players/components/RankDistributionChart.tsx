import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
import { BarChart3 } from "lucide-react";
import { ChartCard, ChartTooltip } from "common/components";
import { usePlayerPageStats } from "features/players/utils/hooks";
import { usePlayers } from "features/players/context/PlayersContext";
import { getColorForPlayer } from "features/players/utils/helpers";

interface RankDistributionChartProps {
	playerId: string;
}

export const RankDistributionChart: React.FC<RankDistributionChartProps> = ({ playerId }) => {
	const { rankCounts } = usePlayerPageStats(playerId);
	const { playerById } = usePlayers();
	const player = playerById.get(playerId);
	const color = getColorForPlayer(player);

	return (
		<ChartCard
			title="Rank Distribution"
			icon={BarChart3}
			iconColor={color}
			isEmpty={rankCounts.length === 0}
			emptyTitle="No rank data"
			emptyDescription="Play some games to see rank distribution"
		>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={rankCounts} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
					<XAxis
						dataKey="rank"
						tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
						label={{
							value: "Rank",
							position: "insideBottom",
							offset: -5,
							fill: "var(--color-text-secondary)",
							fontSize: 12,
						}}
					/>
					<YAxis
						allowDecimals={false}
						tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
						label={{
							value: "Count",
							angle: -90,
							position: "center",
							style: { textAnchor: "middle" },
							fontSize: 12,
							dx: -20,
						}}
					/>
					<Tooltip
						cursor={{ fill: "var(--color-hover)" }}
						content={<ChartTooltip labelFormatter={(v) => `Rank ${v}`} />}
					/>
					<Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
};
