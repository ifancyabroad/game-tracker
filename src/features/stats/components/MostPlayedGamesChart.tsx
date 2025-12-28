import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { BarChart3 } from "lucide-react";
import { ChartCard, ChartTooltip } from "common/components";
import type { MostPlayedGames } from "features/stats/types";

interface MostPlayedGamesChartProps {
	mostPlayedGames: MostPlayedGames[];
}

export const MostPlayedGamesChart: React.FC<MostPlayedGamesChartProps> = ({ mostPlayedGames }) => (
	<ChartCard
		title="Most Played Games"
		icon={BarChart3}
		isEmpty={mostPlayedGames.length === 0}
		emptyTitle="No games played yet"
		emptyDescription="Play some games to see which are most popular"
	>
		<ResponsiveContainer width="100%" height={300}>
			<BarChart data={mostPlayedGames} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
				<CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
				<XAxis
					dataKey="name"
					interval={0}
					tick={({ x, y, payload }) => (
						<g transform={`translate(${x},${y})`}>
							<text
								transform="rotate(-30)"
								textAnchor="end"
								fill="var(--color-text-secondary)"
								fontSize={12}
								dy={10}
							>
								{payload.value}
							</text>
						</g>
					)}
				/>
				<YAxis
					tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
					allowDecimals={false}
					label={{
						value: "Times Played",
						angle: -90,
						position: "center",
						style: { textAnchor: "middle" },
						fontSize: 12,
						dx: -20,
					}}
				/>
				<Tooltip
					cursor={{ fill: "var(--color-hover)" }}
					content={<ChartTooltip formatter={(v) => `${v} plays`} />}
				/>
				<Bar dataKey="count" radius={[4, 4, 0, 0]}>
					{mostPlayedGames.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={entry.color} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	</ChartCard>
);
