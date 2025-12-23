import { useMemo } from "react";
import { getFeaturedStats, getLeaderboard, getPlayerChampionships } from "./calculations";
import { usePlayerData } from "features/players/utils/hooks";
import type { GameType } from "features/games/types";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { useEvents } from "features/events/context/EventsContext";
import { useResults } from "features/events/context/ResultsContext";

export function usePlayerLeaderboard(gameType?: GameType) {
	const playerData = usePlayerData(gameType);
	return useMemo(() => getLeaderboard(playerData), [playerData]);
}

export function usePlayerFeaturedStats(gameType?: GameType) {
	const leaderboard = usePlayerLeaderboard(gameType);
	return useMemo(() => getFeaturedStats(leaderboard), [leaderboard]);
}

export function usePlayerChampionships(gameType?: GameType) {
	const { events } = useEvents();
	const { results } = useResults();
	const { players } = usePlayers();
	const { gameById } = useGames();

	return useMemo(
		() => getPlayerChampionships(events, results, players, gameById, gameType),
		[events, results, players, gameById, gameType],
	);
}
