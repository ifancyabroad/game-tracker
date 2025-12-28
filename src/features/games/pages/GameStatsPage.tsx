import React from "react";
import { useParams, useNavigate } from "react-router";
import { BackButton, Card, KpiCard, HighlightCard, DataTable } from "common/components";
import { Award, Users, TrendingUp, TrendingDown, Star } from "lucide-react";
import { formatPct } from "common/utils/helpers";
import { DISPLAY_LIMITS } from "common/utils/constants";
import { useGameDataById, useGamePageStats } from "features/games/utils/hooks";
import { PlayerWinRateChart } from "features/games/components/PlayerWinRateChart";
import { PlayFrequencyChart } from "features/games/components/PlayFrequencyChart";
import { GameTypeIcon } from "features/games/components/GameTypeIcon";
import type { PlayerGameStats } from "features/games/types";

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
	const navigate = useNavigate();
	const game = useGameDataById(gameId);
	const { topPlayer, bottomPlayer, playerStats, playFrequencySeries } = useGamePageStats(gameId);

	const topPlayerLines = getPlayerLines(topPlayer);
	const bottomPlayerLines = getPlayerLines(bottomPlayer);

	if (!game) {
		return (
			<div className="mx-auto max-w-5xl p-4">
				<div className="mb-4">
					<BackButton />
				</div>
				<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-[var(--color-text-secondary)]">
					Game not found.
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto grid max-w-6xl gap-4 sm:gap-6">
			<BackButton />

			<Card className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 lg:flex-row lg:items-center">
				<div className="flex items-center gap-4">
					<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-accent)]">
						<GameTypeIcon type={game.type} className="h-8 w-8" style={{ color: game.color }} />
					</div>
					<div className="min-w-0">
						<h1 className="truncate text-lg font-semibold text-[var(--color-text)]">{game.data.name}</h1>
						<p className="truncate text-sm text-[var(--color-text-secondary)]">
							{game.data.points} points per win
						</p>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-3 lg:ml-auto lg:grid-cols-4 lg:gap-4">
					<KpiCard
						icon={<GameTypeIcon type={game.type} className="h-4 w-4" style={{ color: game.color }} />}
						label="Times Played"
						value={game.data.timesPlayed}
					/>
					<KpiCard
						icon={<Users className="h-4 w-4" style={{ color: game.color }} />}
						label="Unique Players"
						value={game.data.uniquePlayers}
					/>
					<KpiCard
						icon={<Star className="h-4 w-4" style={{ color: game.color }} />}
						label="Avg Players"
						value={game.data.avgPlayersPerGame}
					/>
					<KpiCard
						icon={<Award className="h-4 w-4" style={{ color: game.color }} />}
						label="Points Awarded"
						value={game.data.totalPointsAwarded}
					/>
				</div>
			</Card>

			<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
				<HighlightCard
					title="Top Player (min 3 plays)"
					icon={<TrendingUp className="h-4 w-4" style={{ color: game.color }} />}
					lines={topPlayerLines}
				/>
				<HighlightCard
					title="Bottom Player (min 3 plays)"
					icon={<TrendingDown className="h-4 w-4" style={{ color: game.color }} />}
					lines={bottomPlayerLines}
				/>
			</div>

			<div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
				<PlayFrequencyChart game={game} playFrequencySeries={playFrequencySeries} />
				<PlayerWinRateChart game={game} playerStats={playerStats} />
			</div>

			<DataTable
				data={[...playerStats].sort((a, b) => b.games - a.games || b.wins - a.wins)}
				columns={[
					{ key: "name", label: "Player", align: "left" },
					{ key: "games", label: "Games", align: "center", width: "w-20 sm:w-24" },
					{ key: "wins", label: "Wins", align: "center", width: "w-20 sm:w-24" },
					{
						key: "winRate",
						label: "Win %",
						align: "center",
						width: "w-20 sm:w-24",
						render: (row: PlayerGameStats) => formatPct(row.winRate),
					},
				]}
				title="Top Players"
				subtitle="Top 10 players by number of games played"
				onRowClick={(row: PlayerGameStats) => navigate(`/players/${row.playerId}`)}
				getRowKey={(row: PlayerGameStats) => row.playerId}
				limit={DISPLAY_LIMITS.TABLES.TOP_PLAYERS}
				emptyMessage="No player stats yet."
			/>
		</div>
	);
};

export default GameStatsPage;
