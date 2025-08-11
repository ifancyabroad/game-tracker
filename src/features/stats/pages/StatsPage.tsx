import { useEvents } from "features/events/context/EventsContext";
import { useResults } from "features/events/context/ResultsContext";
import { StatCard } from "features/stats/components/StatCard";
import { Calendar, Gamepad2, Users, BarChart3 } from "lucide-react";
import { PlayerParticipationChart } from "features/stats/components/PlayerParticipationChart";
import { PlayerWinsOverTimeChart } from "features/stats/components/PlayerWinsOverTimeChart";
import { MostPlayedGamesChart } from "features/stats/components/MostPlayedGamesChart";
import { PlayerWinRateChart } from "features/stats/components/PlayerWinRateChart";

export const StatsPage: React.FC = () => {
	const { events } = useEvents();
	const { results } = useResults();

	const totalGamesPlayed = results.length;
	const totalPlayersInvolved = new Set(results.flatMap((r) => r.playerResults.map((pr) => pr.playerId))).size;
	const totalEvents = events.length;

	return (
		<div className="mx-auto max-w-6xl">
			<div className="mb-4 flex items-center gap-2 text-white">
				<BarChart3 className="h-5 w-5 text-[var(--color-primary)]" />
				<h1 className="text-base font-semibold">Stats</h1>
			</div>

			<div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

			<div className="grid gap-6 md:grid-cols-2">
				<PlayerWinsOverTimeChart />
				<PlayerWinRateChart />
				<MostPlayedGamesChart />
				<PlayerParticipationChart />
			</div>
		</div>
	);
};

export default StatsPage;
