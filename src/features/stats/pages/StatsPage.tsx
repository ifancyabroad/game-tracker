import { StatCard } from "features/stats/components/StatCard";
import { Calendar, Gamepad2, Users, BarChart3 } from "lucide-react";
import { PlayerParticipationChart } from "features/stats/components/PlayerParticipationChart";
import { PlayerWinsOverTimeChart } from "features/stats/components/PlayerWinsOverTimeChart";
import { MostPlayedGamesChart } from "features/stats/components/MostPlayedGamesChart";
import { PlayerWinRateChart } from "features/stats/components/PlayerWinRateChart";
import { useFeaturedStats, useMostPlayedGames, usePlayerWinsOverTime } from "features/stats/utils/hooks";
import { usePlayerData } from "features/players/utils/hooks";

export const StatsPage: React.FC = () => {
	const data = usePlayerData();
	const mostPlayedGames = useMostPlayedGames();
	const playerWinsOverTime = usePlayerWinsOverTime();
	const { totalGamesPlayed, totalPlayersInvolved, totalEvents } = useFeaturedStats();

	return (
		<div className="mx-auto max-w-6xl">
			<div className="mb-3 flex items-center gap-2 text-white sm:mb-4">
				<BarChart3 className="h-5 w-5 text-[var(--color-primary)]" />
				<h1 className="text-base font-semibold">Stats</h1>
			</div>

			<div className="mb-4 grid gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
				<StatCard
					title="Games Played"
					value={totalGamesPlayed.toString()}
					icon={<Gamepad2 size={20} className="text-[var(--color-primary)]" />}
				/>
				<StatCard
					title="Players Involved"
					value={totalPlayersInvolved.toString()}
					icon={<Users size={20} className="text-[var(--color-primary)]" />}
				/>
				<StatCard
					title="Total Events"
					value={totalEvents.toString()}
					icon={<Calendar size={20} className="text-[var(--color-primary)]" />}
				/>
			</div>

			<div className="grid gap-4 sm:gap-6 md:grid-cols-2">
				<PlayerWinsOverTimeChart overallStats={data} playerWinsOverTime={playerWinsOverTime} />
				<PlayerWinRateChart overallStats={data} />
				<MostPlayedGamesChart mostPlayedGames={mostPlayedGames} />
				<PlayerParticipationChart overallStats={data} />
			</div>
		</div>
	);
};

export default StatsPage;
