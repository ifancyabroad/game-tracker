import React from "react";
import { useParams, useNavigate } from "react-router";
import { BackButton, Card, KpiCard, HighlightCard, DataTable, Chip } from "common/components";
import { Award, Users, TrendingUp, TrendingDown, Star, Gamepad2 } from "lucide-react";
import { formatPct } from "common/utils/helpers";
import { DISPLAY_LIMITS } from "common/utils/constants";
import { useGameDataById, useGamePageStats } from "features/games/utils/hooks";
import { PlayerWinRateChart } from "features/games/components/PlayerWinRateChart";
import { PlayFrequencyChart } from "features/games/components/PlayFrequencyChart";
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
	const gameWithData = useGameDataById(gameId);
	const { topPlayer, bottomPlayer, playerStats } = useGamePageStats(gameId);

	const topPlayerLines = getPlayerLines(topPlayer);
	const bottomPlayerLines = getPlayerLines(bottomPlayer);

	if (!gameWithData) {
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
					<div className="min-w-0 flex-1">
						<h1 className="truncate text-xl font-bold text-[var(--color-text)] md:text-2xl">
							{gameWithData.name}
						</h1>
						<p className="mt-1 text-sm text-[var(--color-text-secondary)]">
							{gameWithData.points} {gameWithData.points === 1 ? "point" : "points"} per win
						</p>
						{gameWithData.tags && gameWithData.tags.length > 0 && (
							<div className="mt-2 flex flex-wrap gap-1">
								{gameWithData.tags.map((tag) => (
									<Chip key={tag} label={tag} className="pointer-events-none" />
								))}
							</div>
						)}
					</div>
				</div>
				<div className="grid grid-cols-2 gap-3 lg:ml-auto lg:grid-cols-4 lg:gap-4">
					<KpiCard
						icon={<Gamepad2 className="h-4 w-4 text-[var(--color-primary)]" />}
						label="Times Played"
						value={gameWithData.data.timesPlayed}
					/>
					<KpiCard
						icon={<Users className="h-4 w-4 text-[var(--color-primary)]" />}
						label="Unique Players"
						value={gameWithData.data.uniquePlayers}
					/>
					<KpiCard
						icon={<Star className="h-4 w-4 text-[var(--color-primary)]" />}
						label="Avg Players"
						value={gameWithData.data.avgPlayersPerGame}
					/>
					<KpiCard
						icon={<Award className="h-4 w-4 text-[var(--color-primary)]" />}
						label="Points Awarded"
						value={gameWithData.data.totalPointsAwarded}
					/>
				</div>
			</Card>

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
				<PlayFrequencyChart gameId={gameId} />
				<PlayerWinRateChart gameId={gameId} />
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
