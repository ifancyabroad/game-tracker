import React from "react";
import { useParams } from "react-router";
import { Avatar, BackButton, Card, KpiCard, HighlightCard, PageHeader } from "common/components";
import { Award, Gamepad2, ListOrdered, Percent, Star, TrendingDown, TrendingUp } from "lucide-react";
import { formatPct } from "common/utils/helpers";
import { usePlayerDataById } from "features/players/utils/hooks";
import { usePlayerPageStats, usePlayerStreaks, useTopOpponents } from "features/players/utils/hooks";
import { RecentFormChart } from "features/players/components/RecentFormChart";
import { RankDistributionChart } from "features/players/components/RankDistributionChart";
import { WinRateByGameChart } from "features/players/components/WinRateByGameChart";
import { PointsByGameChart } from "features/players/components/PointsByGameChart";
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
	const player = usePlayerDataById(playerId);
	const { bestGame, mostPlayed, mostPoints, rankCounts, gameWinRates, lastGamesSeries } =
		usePlayerPageStats(playerId);
	const { longestWinStreak, longestLossStreak } = usePlayerStreaks(playerId);
	const topOpponents = useTopOpponents(playerId);
	const bestGameLines = getBestGameLines(bestGame);
	const mostPlayedLines = getMostPlayedLines(mostPlayed);
	const mostPointsLines = getMostPointsLines(mostPoints);

	if (!player) {
		return (
			<div className="mx-auto max-w-5xl p-4">
				<div className="mb-4">
					<BackButton />
				</div>
				<div className="rounded-xl border border-gray-700 bg-[var(--color-surface)] p-6 text-gray-300">
					Player not found.
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto grid max-w-6xl gap-4 sm:gap-6">
			<PageHeader icon={<BackButton />} title="" />

			<Card className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
				<div className="flex items-center gap-4">
					<Avatar src={player.pictureUrl || undefined} name={player.data.name} size={56} />
					<div className="min-w-0">
						<h1 className="truncate text-lg font-semibold text-white">{player.data.name}</h1>
						{player.data.fullName !== player.data.name && (
							<p className="truncate text-sm text-gray-400">{player.data.fullName}</p>
						)}
					</div>
				</div>
				<div className="grid grid-cols-2 gap-3 sm:ml-auto sm:grid-cols-3 sm:gap-4">
					<KpiCard
						icon={<ListOrdered className="h-4 w-4" style={{ color: player.color }} />}
						label="Games"
						value={player.data.games}
					/>
					<KpiCard
						icon={<Award className="h-4 w-4" style={{ color: player.color }} />}
						label="Wins"
						value={player.data.wins}
					/>
					<KpiCard
						icon={<Percent className="h-4 w-4" style={{ color: player.color }} />}
						label="Win Rate"
						value={`${player.data.winRatePercent}%`}
					/>
					<KpiCard
						icon={<Star className="h-4 w-4" style={{ color: player.color }} />}
						label="Points"
						value={player.data.points}
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
			</Card>

			<div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
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

			<div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
				<RecentFormChart player={player} lastGamesSeries={lastGamesSeries} />

				<RankDistributionChart player={player} rankCounts={rankCounts} />
			</div>

			<PerformanceByGameTable gameWinRates={gameWinRates} />

			<div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
				<WinRateByGameChart gameWinRates={gameWinRates} />

				<PointsByGameChart gameWinRates={gameWinRates} />
			</div>

			<HeadToHeadTable topOpponents={topOpponents} />
		</div>
	);
};

export default PlayerStatsPage;
