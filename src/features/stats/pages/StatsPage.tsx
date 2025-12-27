import { Calendar, Gamepad2, Users, BarChart3, Trophy, Star, TrendingUp } from "lucide-react";
import { PlayerWinsOverTimeChart } from "features/stats/components/PlayerWinsOverTimeChart";
import { MostPlayedGamesChart } from "features/stats/components/MostPlayedGamesChart";
import { PlayerWinRateChart } from "features/stats/components/PlayerWinRateChart";
import { WinStreaksCard } from "features/stats/components/WinStreaksCard";
import { LossStreaksCard } from "features/stats/components/LossStreaksCard";
import { GameTrendsChart } from "features/stats/components/GamesTrendsChart";
import { TopWinningPlayersChart } from "features/stats/components/TopWinningPlayersChart";
import { GameDifficultyChart } from "features/stats/components/GameDifficultyChart";
import { RivalryMatrix } from "features/stats/components/RivalryMatrix";
import { PlayerAttendanceCard } from "features/stats/components/PlayerAttendanceCard";
import {
	useFeaturedStats,
	useMostPlayedGames,
	usePlayerWinsOverTime,
	useWinStreaks,
	useLossStreaks,
	useGameTrends,
	useGameDifficulty,
	useTopRivalries,
	usePlayerAttendance,
} from "features/stats/utils/hooks";
import { usePlayerData } from "features/players/utils/hooks";
import { usePlayerFeaturedStats } from "features/leaderboard/utils/hooks";
import { PageHeader, Card, KpiCard } from "common/components";

export const StatsPage: React.FC = () => {
	const data = usePlayerData();
	const mostPlayedGames = useMostPlayedGames();
	const playerWinsOverTime = usePlayerWinsOverTime();
	const winStreaks = useWinStreaks();
	const lossStreaks = useLossStreaks();
	const gameTrends = useGameTrends();
	const gameDifficulty = useGameDifficulty();
	const topRivalries = useTopRivalries(5);
	const playerAttendance = usePlayerAttendance(5);

	const { totalGamesPlayed, totalPlayersInvolved, totalEvents } = useFeaturedStats();
	const { mostPoints, mostWins } = usePlayerFeaturedStats();

	const avgGamesPerEvent = totalEvents > 0 ? (totalGamesPlayed / totalEvents).toFixed(1) : "0";

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
						icon={<TrendingUp size={16} className="text-[var(--color-primary)]" />}
						label="Games/Event"
						value={avgGamesPerEvent}
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
				<h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-secondary)] uppercase">
					Trends Over Time
				</h2>
			</div>
			<div className="mb-4 grid gap-4 sm:mb-6 sm:gap-6 md:grid-cols-2">
				<PlayerWinsOverTimeChart overallStats={data} playerWinsOverTime={playerWinsOverTime} />
				<GameTrendsChart gameTrends={gameTrends} />
			</div>

			{/* Player Performance Section */}
			<div className="mb-3 sm:mb-4">
				<h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-secondary)] uppercase">
					Player Performance
				</h2>
			</div>
			<div className="mb-4 grid gap-4 sm:mb-6 sm:gap-6 md:grid-cols-2">
				<PlayerWinRateChart overallStats={data} />
				<TopWinningPlayersChart overallStats={data} />
				<WinStreaksCard streaks={winStreaks} />
				<LossStreaksCard streaks={lossStreaks} />
				<PlayerAttendanceCard attendances={playerAttendance} />
				<RivalryMatrix rivalries={topRivalries} />
			</div>

			{/* Game Insights Section */}
			<div className="mb-3 sm:mb-4">
				<h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-secondary)] uppercase">
					Game Insights
				</h2>
			</div>
			<div className="grid gap-4 sm:gap-6 md:grid-cols-2">
				<MostPlayedGamesChart mostPlayedGames={mostPlayedGames} />
				<GameDifficultyChart difficulties={gameDifficulty} />
			</div>
		</div>
	);
};

export default StatsPage;
