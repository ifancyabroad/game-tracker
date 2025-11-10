import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { useEvents } from "features/events/context/EventsContext";
import { useResults } from "features/events/context/ResultsContext";

export function useAppReady() {
	const p = usePlayers();
	const g = useGames();
	const e = useEvents();
	const r = useResults();
	return { loading: p.loading || g.loading || e.loading || r.loading };
}
