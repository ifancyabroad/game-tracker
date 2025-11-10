import React from "react";
import { useParams, Link } from "react-router";
import { usePlayers } from "features/players/context/PlayersContext";
import { Avatar } from "common/components/Avatar";
import { ArrowLeft, Award, Gamepad2, ListOrdered, Percent, Star, TrendingDown, TrendingUp } from "lucide-react";
import { getDisplayName, getFullName } from "features/players/utils/helpers";
import { KpiCard } from "features/players/components/KpiCard";
import { HighlightCard } from "features/players/components/HighlightCard";
import { formatPct } from "common/utils/helpers";
import { usePlayerStatsMap } from "features/events/utils/hooks";
import { usePlayerPageStats, usePlayerStreaks, useTopOpponents } from "features/players/utils/hooks";
import { RecentFormChart } from "features/players/components/RecentFormChart";
import { RankDistributionChart } from "features/players/components/RankDistributionChart";
import { WinRateByGameChart } from "features/players/components/WinRateByGameChart";
import { PerformanceByGameTable } from "features/players/components/PerformanceByGameTable";
import { HeadToHeadTable } from "features/players/components/HeadToHeadTable";
import type { GameWinRateRow } from "features/players/utils/stats";

const getBestGameLines = (bestGame?: GameWinRateRow) => {
	if (!bestGame) {
		return [{ k: "Not enough data", v: "Play at least 3 games" }];
	}

	return [
		{ k: "Game", v: bestGame.name },
		{ k: "Win Rate", v: formatPct(bestGame.wr) },
		{ k: "Sample", v: `${bestGame.wins}/${bestGame.games}` },
	];
};

const getMostPlayedLines = (mostPlayed?: GameWinRateRow) => {
	if (!mostPlayed) {
		return [{ k: "No games yet", v: "—" }];
	}

	return [
		{ k: "Game", v: mostPlayed.name },
		{ k: "Plays", v: `${mostPlayed.games}` },
		{ k: "Wins", v: `${mostPlayed.wins}` },
	];
};

const getMostPointsLines = (mostPoints?: GameWinRateRow) => {
	if (!mostPoints) {
		return [{ k: "No points yet", v: "—" }];
	}

	return [
		{ k: "Game", v: mostPoints.name },
		{ k: "Points", v: `${mostPoints.points}` },
		{ k: "Sample", v: `${mostPoints.wins}/${mostPoints.games}` },
	];
};

export const PlayerStatsPage: React.FC = () => {
	const { id: playerIdParam } = useParams<{ id: string }>();
	const playerId = String(playerIdParam || "");
	const { players } = usePlayers();
	const statsMap = usePlayerStatsMap();
	const playerStats = statsMap.get(playerId);
	const { bestGame, mostPlayed, mostPoints, rankCounts, gameWinRates, lastGamesSeries } =
		usePlayerPageStats(playerId);
	const { longestWinStreak, longestLossStreak } = usePlayerStreaks(playerId);
	const topOpponents = useTopOpponents(playerId);

	const player = players.find((p) => p.id === playerId);
	const name = getDisplayName(player);
	const fullName = getFullName(player);
	const bestGameLines = getBestGameLines(bestGame);
	const mostPlayedLines = getMostPlayedLines(mostPlayed);
	const mostPointsLines = getMostPointsLines(mostPoints);

	if (!player) {
		return (
			<div className="mx-auto max-w-5xl p-4">
				<div className="mb-4">
					<Link to="/" className="inline-flex items-center gap-2 text-[var(--color-primary)]">
						<ArrowLeft className="h-4 w-4" /> Back
					</Link>
				</div>
				<div className="rounded-xl border border-gray-700 bg-[var(--color-surface)] p-6 text-gray-300">
					Player not found.
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto grid max-w-6xl gap-6">
			<div className="flex items-center justify-between gap-3">
				<Link to="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white">
					<ArrowLeft className="h-4 w-4" />
					<span className="text-sm">Back</span>
				</Link>
			</div>

			<div className="flex flex-col gap-4 rounded-xl border border-gray-700 bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center">
				<div className="flex items-center gap-4">
					<Avatar src={player.pictureUrl || undefined} name={name} size={56} />
					<div className="min-w-0">
						<h1 className="truncate text-lg font-semibold text-white">{name}</h1>
						{fullName !== name && <p className="truncate text-sm text-gray-400">{fullName}</p>}
					</div>
				</div>
				{playerStats && (
					<div className="grid grid-cols-2 gap-3 sm:ml-auto sm:grid-cols-3 sm:gap-4">
						<KpiCard
							icon={<ListOrdered className="h-4 w-4" style={{ color: player.color }} />}
							label="Games"
							value={playerStats.games}
						/>
						<KpiCard
							icon={<Award className="h-4 w-4" style={{ color: player.color }} />}
							label="Wins"
							value={playerStats.wins}
						/>
						<KpiCard
							icon={<Percent className="h-4 w-4" style={{ color: player.color }} />}
							label="Win Rate"
							value={formatPct(playerStats.winRate)}
						/>
						<KpiCard
							icon={<Star className="h-4 w-4" style={{ color: player.color }} />}
							label="Points"
							value={playerStats.points}
						/>
						<KpiCard
							label="Best Streak"
							value={`${longestWinStreak}`}
							icon={<TrendingUp className="h-4 w-4" style={{ color: player.color }} />}
						/>
						<KpiCard
							icon={<TrendingDown className="h-4 w-4" style={{ color: player.color }} />}
							label="Worst Streak"
							value={`${longestLossStreak}`}
						/>
					</div>
				)}
			</div>

			<div className="grid gap-6 sm:grid-cols-3">
				<HighlightCard
					title="Best Game (min 3 plays)"
					icon={<TrendingUp className="h-4 w-4" style={{ color: player.color }} />}
					lines={bestGameLines}
				/>
				<HighlightCard
					title="Most Played"
					icon={<Gamepad2 className="h-4 w-4" style={{ color: player.color }} />}
					lines={mostPlayedLines}
				/>
				<HighlightCard
					title="Most Points"
					icon={<Star className="h-4 w-4" style={{ color: player.color }} />}
					lines={mostPointsLines}
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<RecentFormChart player={player} lastGamesSeries={lastGamesSeries} />

				<RankDistributionChart player={player} rankCounts={rankCounts} />
			</div>

			<PerformanceByGameTable gameWinRates={gameWinRates} />

			<div className="grid gap-6 lg:grid-cols-2">
				<WinRateByGameChart player={player} gameWinRates={gameWinRates} />
			</div>

			<HeadToHeadTable topOpponents={topOpponents} />
		</div>
	);
};

export default PlayerStatsPage;
