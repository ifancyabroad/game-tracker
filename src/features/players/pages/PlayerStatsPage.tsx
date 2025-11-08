import React from "react";
import { useParams, Link } from "react-router";
import { usePlayers } from "features/players/context/PlayersContext";
import { useResults } from "features/events/context/ResultsContext";
import { useGames } from "features/games/context/GamesContext";
import { Avatar } from "common/components/Avatar";
import { ArrowLeft, Award, Gamepad2, ListOrdered, Percent, TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { getDisplayName, getFullName } from "features/players/utils/helpers";
import { ChartCard } from "features/stats/components/ChartCard";
import { KpiCard } from "features/players/components/KpiCard";
import { HighlightCard } from "features/players/components/HighlightCard";
import { formatPct } from "common/utils/helpers";
import { usePlayerStatsMap } from "features/events/utils/hooks";
import { usePlayerPageStats } from "features/players/utils/hooks";

export const PlayerStatsPage: React.FC = () => {
	const { id: playerIdParam } = useParams<{ id: string }>();
	const playerId = String(playerIdParam || "");
	const { players } = usePlayers();
	const { results } = useResults();
	const { games } = useGames();
	const statsMap = usePlayerStatsMap(players, results, games);
	const playerStats = statsMap.get(playerId);
	const { bestGame, mostPlayed, rankCounts, gameWinRates, lastGamesSeries } = usePlayerPageStats(
		playerId,
		results,
		games,
	);

	const player = players.find((p) => p.id === playerId);
	const name = getDisplayName(player);
	const fullName = getFullName(player);

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
		<div className="mx-auto grid max-w-6xl gap-8">
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
					<div className="grid grid-cols-3 gap-3 sm:ml-auto sm:gap-4">
						<KpiCard
							icon={<ListOrdered className="h-4 w-4 text-[var(--color-primary)]" />}
							label="Games"
							value={playerStats.games}
						/>
						<KpiCard
							icon={<Award className="h-4 w-4 text-[var(--color-primary)]" />}
							label="Wins"
							value={playerStats.wins}
						/>
						<KpiCard
							icon={<Percent className="h-4 w-4 text-[var(--color-primary)]" />}
							label="Win Rate"
							value={formatPct(playerStats.winRate)}
						/>
					</div>
				)}
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<HighlightCard
					title="Best Game (min 3 plays)"
					icon={<TrendingUp className="h-4 w-4 text-[var(--color-primary)]" />}
					lines={
						bestGame
							? [
									{ k: "Game", v: bestGame.name },
									{ k: "Win Rate", v: formatPct(bestGame.wr) },
									{ k: "Sample", v: `${bestGame.wins}/${bestGame.games}` },
								]
							: [{ k: "Not enough data", v: "Play at least 3 games" }]
					}
				/>
				<HighlightCard
					title="Most Played"
					icon={<Gamepad2 className="h-4 w-4 text-[var(--color-primary)]" />}
					lines={
						mostPlayed
							? [
									{ k: "Game", v: mostPlayed.name },
									{ k: "Plays", v: `${mostPlayed.games}` },
									{ k: "Wins", v: `${mostPlayed.wins}` },
								]
							: [{ k: "No games yet", v: "—" }]
					}
				/>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<ChartCard title="Recent Form (last 20 games)">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={lastGamesSeries}>
							<CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
							<XAxis dataKey="x" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
							<YAxis domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
							<Tooltip
								contentStyle={{
									background: "var(--color-surface)",
									border: "1px solid #334155",
									color: "#E5E7EB",
								}}
								labelFormatter={(v) => `Game ${v}`}
								formatter={(v) => [`${v}%`, "Win Rate"]}
							/>
							<Line type="monotone" dataKey="wr" stroke={player.color} strokeWidth={2} dot={false} />
						</LineChart>
					</ResponsiveContainer>
				</ChartCard>

				<ChartCard title="Rank Distribution">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={rankCounts}>
							<CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
							<XAxis dataKey="rank" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
							<YAxis allowDecimals={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
							<Tooltip
								contentStyle={{
									background: "var(--color-surface)",
									border: "1px solid #334155",
									color: "#E5E7EB",
								}}
								formatter={(v) => [String(v), "Count"]}
							/>
							<Bar dataKey="count" fill={player.color} />
						</BarChart>
					</ResponsiveContainer>
				</ChartCard>
			</div>

			<div className="rounded-xl border border-gray-700 bg-[var(--color-surface)]">
				<div className="border-b border-gray-700 px-4 py-3">
					<h2 className="text-base font-semibold text-white">Performance by Game</h2>
					<p className="text-xs text-gray-400">Top games by play count</p>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="bg-black/20 text-left text-gray-300">
							<tr>
								<th className="px-4 py-2">Game</th>
								<th className="w-24 px-4 py-2 text-center">Games</th>
								<th className="w-24 px-4 py-2 text-center">Wins</th>
								<th className="w-24 px-4 py-2 text-center">Win %</th>
							</tr>
						</thead>
						<tbody>
							{gameWinRates
								.slice()
								.sort((a, b) => b.games - a.games)
								.slice(0, 5)
								.map((g) => (
									<tr
										key={g.gameId}
										className="border-b border-gray-700 last:border-b-0 hover:bg-white/5"
									>
										<td className="px-4 py-2 text-white">{g.name}</td>
										<td className="px-4 py-2 text-center text-gray-200 tabular-nums">{g.games}</td>
										<td className="px-4 py-2 text-center text-gray-200 tabular-nums">{g.wins}</td>
										<td className="px-4 py-2 text-center text-gray-200 tabular-nums">
											{Math.round(g.wr * 100)}%
										</td>
									</tr>
								))}
							{gameWinRates.length === 0 && (
								<tr>
									<td colSpan={4} className="px-4 py-6 text-center text-gray-400">
										No game stats yet.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default PlayerStatsPage;
