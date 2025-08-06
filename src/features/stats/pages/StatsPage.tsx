import { useEvents } from "features/events/context/EventsContext";
import { useResults } from "features/events/context/ResultsContext";
import { StatCard } from "features/stats/components/StatCard";
import { Calendar, Gamepad2, Users } from "lucide-react";
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
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-3">
				<StatCard title="Games Played" value={totalGamesPlayed.toString()} icon={<Gamepad2 size={20} />} />
				<StatCard title="Players Involved" value={totalPlayersInvolved.toString()} icon={<Users size={20} />} />
				<StatCard title="Total Events" value={totalEvents.toString()} icon={<Calendar size={20} />} />
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
