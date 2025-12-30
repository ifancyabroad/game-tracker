import { Calendar, Gamepad2, Users, BarChart3, Trophy, Star } from "lucide-react";
import { PlayerWinsOverTimeChart } from "features/stats/components/PlayerWinsOverTimeChart";
import { MostPlayedGamesChart } from "features/stats/components/MostPlayedGamesChart";
import { PlayerWinRateChart } from "features/stats/components/PlayerWinRateChart";
import { StreaksCard } from "features/stats/components/StreaksCard";
import { GameTrendsChart } from "features/stats/components/GamesTrendsChart";
import { TopWinningPlayersChart } from "features/stats/components/TopWinningPlayersChart";
import { GamePointsChart } from "features/stats/components/GamePointsChart";
import { RivalryMatrix } from "features/stats/components/RivalryMatrix";
import {
	useFeaturedStats,
	useMostPlayedGames,
	useWinStreaks,
	useLossStreaks,
	useTopRivalries,
	useLopsidedRivalries,
} from "features/stats/utils/hooks";
import { usePlayerFeaturedStats } from "features/leaderboard/utils/hooks";
import { PageHeader, Card, KpiCard } from "common/components";

export const StatsPage: React.FC = () => {
	const mostPlayedGames = useMostPlayedGames();
	const winStreaks = useWinStreaks();
	const lossStreaks = useLossStreaks();
	const topRivalries = useTopRivalries();
	const lopsidedRivalries = useLopsidedRivalries();

	const { totalGamesPlayed, totalPlayersInvolved, totalEvents } = useFeaturedStats();
	const { mostPoints, mostWins } = usePlayerFeaturedStats();

	const mostPlayedGame = mostPlayedGames.length > 0 ? mostPlayedGames[0].name : "N/A";

	return (
		<div className="mx-auto max-w-6xl">
			<PageHeader icon={<BarChart3 />} title="Stats" />

			{/* Overview Section - Compact KPI Cards */}
			<Card className="mb-4 p-3 sm:mb-6 sm:p-4">
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
					<KpiCard
						icon={<Gamepad2 size={16} className="text-[var(--color-primary)]" />}
						label="Games Played"
						value={totalGamesPlayed}
					/>
					<KpiCard
						icon={<Users size={16} className="text-[var(--color-primary)]" />}
						label="Players"
						value={totalPlayersInvolved}
					/>
					<KpiCard
						icon={<Calendar size={16} className="text-[var(--color-primary)]" />}
						label="Events"
						value={totalEvents}
					/>
					<KpiCard
						icon={<Gamepad2 size={16} className="text-[var(--color-primary)]" />}
						label="Most Played"
						value={mostPlayedGame}
					/>
					<KpiCard
						icon={<Trophy size={16} className="text-[var(--color-primary)]" />}
						label="Most Wins"
						value={mostWins?.data.name ?? "N/A"}
					/>
					<KpiCard
						icon={<Star size={16} className="text-[var(--color-primary)]" />}
						label="Most Points"
						value={mostPoints?.data.name ?? "N/A"}
					/>
				</div>
			</Card>

			{/* Trends Over Time Section */}
			<div className="mb-3 sm:mb-4">
				<h2 className="text-base font-bold text-[var(--color-text)] md:text-lg">Trends Over Time</h2>
			</div>
			<div className="mb-4 grid gap-4 sm:mb-6 sm:gap-6 lg:grid-cols-2">
				<PlayerWinsOverTimeChart />
				<GameTrendsChart />
			</div>

			{/* Player Performance Section */}
			<div className="mb-3 sm:mb-4">
				<h2 className="text-base font-bold text-[var(--color-text)] md:text-lg">Player Performance</h2>
			</div>
			<div className="mb-4 grid gap-4 sm:mb-6 sm:gap-6 lg:grid-cols-2">
				<PlayerWinRateChart />
				<TopWinningPlayersChart />
				<StreaksCard streaks={winStreaks} type="win" />
				<StreaksCard streaks={lossStreaks} type="loss" />
				<RivalryMatrix
					rivalries={topRivalries}
					title="Most Competitive Rivalries"
					description="Closest head-to-head matchups with similar win rates"
				/>
				<RivalryMatrix
					rivalries={lopsidedRivalries}
					title="Most Dominant Rivalries"
					description="One-sided matchups where one player significantly outperforms the other"
				/>
			</div>

			{/* Game Insights Section */}
			<div className="mb-3 sm:mb-4">
				<h2 className="text-base font-bold text-[var(--color-text)] md:text-lg">Game Insights</h2>
			</div>
			<div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
				<MostPlayedGamesChart />
				<GamePointsChart />
			</div>
		</div>
	);
};

export default StatsPage;
