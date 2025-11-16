import React from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Award, Users, TrendingUp, Star, Gamepad2 } from "lucide-react";
import { KpiCard } from "common/components/KpiCard";
import { HighlightCard } from "common/components/HighlightCard";
import { formatPct } from "common/utils/helpers";
import { useGameDataById, useGamePageStats } from "features/games/utils/hooks";
import { PlayerWinRateChart } from "features/games/components/PlayerWinRateChart";
import { PlayFrequencyChart } from "features/games/components/PlayFrequencyChart";
import { TopPlayersTable } from "features/games/components/TopPlayersTable";

const getTopPlayerLines = (topPlayer?: { name: string; winRate: number; games: number; wins: number }) => {
	if (!topPlayer) {
		return [{ k: "Not enough data", v: "Min 3 games each" }];
	}

	return [
		{ k: "Player", v: topPlayer.name },
		{ k: "Win Rate", v: formatPct(topPlayer.winRate) },
		{ k: "Sample", v: `${topPlayer.wins}/${topPlayer.games}` },
	];
};

const getMostFrequentLines = (mostFrequent?: { name: string; games: number; wins: number }) => {
	if (!mostFrequent) {
		return [{ k: "No players yet", v: "—" }];
	}

	return [
		{ k: "Player", v: mostFrequent.name },
		{ k: "Plays", v: `${mostFrequent.games}` },
		{ k: "Wins", v: `${mostFrequent.wins}` },
	];
};

export const GameStatsPage: React.FC = () => {
	const { id: gameIdParam } = useParams<{ id: string }>();
	const gameId = String(gameIdParam || "");
	const game = useGameDataById(gameId);
	const { topPlayer, mostFrequentPlayer, playerStats, playFrequencySeries } = useGamePageStats(gameId);

	const topPlayerLines = getTopPlayerLines(topPlayer);
	const mostFrequentLines = getMostFrequentLines(mostFrequentPlayer);

	// Default color for charts
	const gameColor = "#3b82f6";

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
		<div className="mx-auto grid max-w-6xl gap-6">
			<div className="flex items-center justify-between gap-3">
				<Link to="/games" className="inline-flex items-center gap-2 text-gray-300 hover:text-white">
					<ArrowLeft className="h-4 w-4" />
					<span className="text-sm">Back</span>
				</Link>
			</div>

			<div className="flex flex-col gap-4 rounded-xl border border-gray-700 bg-[var(--color-surface)] p-4 lg:flex-row lg:items-center">
				<div className="flex items-center gap-4">
					<div
						className="flex h-14 w-14 items-center justify-center rounded-xl"
						style={{ backgroundColor: gameColor + "20" }}
					>
						<Gamepad2 className="h-8 w-8" style={{ color: gameColor }} />
					</div>
					<div className="min-w-0">
						<h1 className="truncate text-lg font-semibold text-white">{game.data.name}</h1>
						<p className="truncate text-sm text-gray-400">{game.data.points} points per win</p>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-3 lg:ml-auto lg:grid-cols-4 lg:gap-4">
					<KpiCard
						icon={<Gamepad2 className="h-4 w-4" style={{ color: gameColor }} />}
						label="Times Played"
						value={game.data.timesPlayed}
					/>
					<KpiCard
						icon={<Users className="h-4 w-4" style={{ color: gameColor }} />}
						label="Unique Players"
						value={game.data.uniquePlayers}
					/>
					<KpiCard
						icon={<Award className="h-4 w-4" style={{ color: gameColor }} />}
						label="Total Wins"
						value={game.data.totalWinners}
					/>
					<KpiCard
						icon={<Star className="h-4 w-4" style={{ color: gameColor }} />}
						label="Avg Players"
						value={game.data.avgPlayersPerGame}
					/>
				</div>
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				<HighlightCard
					title="Top Player (min 3 plays)"
					icon={<TrendingUp className="h-4 w-4" style={{ color: gameColor }} />}
					lines={topPlayerLines}
				/>
				<HighlightCard
					title="Most Frequent Player"
					icon={<Users className="h-4 w-4" style={{ color: gameColor }} />}
					lines={mostFrequentLines}
				/>
			</div>

			<TopPlayersTable playerStats={playerStats} />

			<div className="grid gap-6 lg:grid-cols-2">
				<PlayFrequencyChart playFrequencySeries={playFrequencySeries} gameColor={gameColor} />
				<PlayerWinRateChart playerStats={playerStats} />
			</div>
		</div>
	);
};

export default GameStatsPage;
