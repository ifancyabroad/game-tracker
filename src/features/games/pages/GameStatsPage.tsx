import React from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Award, Users, TrendingUp, TrendingDown, Star } from "lucide-react";
import { KpiCard } from "common/components/KpiCard";
import { HighlightCard } from "common/components/HighlightCard";
import { formatPct } from "common/utils/helpers";
import { useGameDataById, useGamePageStats } from "features/games/utils/hooks";
import { PlayerWinRateChart } from "features/games/components/PlayerWinRateChart";
import { PlayFrequencyChart } from "features/games/components/PlayFrequencyChart";
import { TopPlayersTable } from "features/games/components/TopPlayersTable";
import { GameTypeIcon } from "features/games/components/GameTypeIcon";

const getPlayerLines = (player?: { name: string; winRate: number; games: number; wins: number }) => {
	if (!player) {
		return [{ k: "Not enough data", v: "Min 3 games each" }];
	}

	return [
		{ k: "Player", v: player.name },
		{ k: "Win Rate", v: formatPct(player.winRate) },
		{ k: "Sample", v: `${player.wins}/${player.games}` },
	];
};

export const GameStatsPage: React.FC = () => {
	const { id: gameIdParam } = useParams<{ id: string }>();
	const gameId = String(gameIdParam || "");
	const game = useGameDataById(gameId);
	const { topPlayer, bottomPlayer, playerStats, playFrequencySeries } = useGamePageStats(gameId);

	const topPlayerLines = getPlayerLines(topPlayer);
	const bottomPlayerLines = getPlayerLines(bottomPlayer);

	if (!game) {
		return (
			<div className="mx-auto max-w-5xl p-4">
				<div className="mb-4">
					<Link to="/games" className="inline-flex items-center gap-2 text-[var(--color-primary)]">
						<ArrowLeft className="h-4 w-4" /> Back
					</Link>
				</div>
				<div className="rounded-xl border border-gray-700 bg-[var(--color-surface)] p-6 text-gray-300">
					Game not found.
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto grid max-w-6xl gap-4 sm:gap-6">
			<div className="flex items-center justify-between gap-3">
				<Link to="/games" className="inline-flex items-center gap-2 text-gray-300 hover:text-white">
					<ArrowLeft className="h-4 w-4" />
					<span className="text-sm">Back</span>
				</Link>
			</div>

			<div className="flex flex-col gap-3 rounded-xl border border-gray-700 bg-[var(--color-surface)] p-3 sm:gap-4 sm:p-4 lg:flex-row lg:items-center">
				<div className="flex items-center gap-4">
					<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-black/30">
						<GameTypeIcon type={game.type} className="h-8 w-8 text-[var(--color-primary)]" />
					</div>
					<div className="min-w-0">
						<h1 className="truncate text-lg font-semibold text-white">{game.data.name}</h1>
						<p className="truncate text-sm text-gray-400">{game.data.points} points per win</p>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-3 lg:ml-auto lg:grid-cols-4 lg:gap-4">
					<KpiCard
						icon={<GameTypeIcon type={game.type} className="h-4 w-4 text-[var(--color-primary)]" />}
						label="Times Played"
						value={game.data.timesPlayed}
					/>
					<KpiCard
						icon={<Users className="h-4 w-4 text-[var(--color-primary)]" />}
						label="Unique Players"
						value={game.data.uniquePlayers}
					/>
					<KpiCard
						icon={<Star className="h-4 w-4 text-[var(--color-primary)]" />}
						label="Avg Players"
						value={game.data.avgPlayersPerGame}
					/>
					<KpiCard
						icon={<Award className="h-4 w-4 text-[var(--color-primary)]" />}
						label="Points Awarded"
						value={game.data.totalPointsAwarded}
					/>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
				<HighlightCard
					title="Top Player (min 3 plays)"
					icon={<TrendingUp className="h-4 w-4 text-[var(--color-primary)]" />}
					lines={topPlayerLines}
				/>
				<HighlightCard
					title="Bottom Player (min 3 plays)"
					icon={<TrendingDown className="h-4 w-4 text-[var(--color-primary)]" />}
					lines={bottomPlayerLines}
				/>
			</div>

			<div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
				<PlayFrequencyChart playFrequencySeries={playFrequencySeries} />
				<PlayerWinRateChart playerStats={playerStats} />
			</div>

			<TopPlayersTable playerStats={playerStats} />
		</div>
	);
};

export default GameStatsPage;
