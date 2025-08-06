import { useMemo } from "react";
import { useGames } from "features/games/context/GamesContext";
import { useEvents } from "features/events/context/EventsContext";
import { useResults } from "features/events/context/ResultsContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { StatCard } from "features/stats/components/StatCard";
import { ChartCard } from "features/stats/components/ChartCard";
import { Calendar, Gamepad2, Users } from "lucide-react";
import { usePlayers } from "features/players/context/PlayersContext";
import { CustomTooltip } from "features/stats/components/ChartTooltip";

export const StatsPage: React.FC = () => {
	const { games } = useGames();
	const { events } = useEvents();
	const { results } = useResults();
	const { players } = usePlayers();

	const totalGamesPlayed = results.length;
	const totalPlayersInvolved = new Set(results.flatMap((r) => r.playerResults.map((pr) => pr.playerId))).size;
	const totalEvents = events.length;

	const mostPlayedGames = useMemo(() => {
		const gameCount: Record<string, number> = {};
		results.forEach((r) => {
			gameCount[r.gameId] = (gameCount[r.gameId] || 0) + 1;
		});
		return Object.entries(gameCount)
			.map(([gameId, count]) => ({
				name: games.find((g) => g.id === gameId)?.name || "Unknown",
				count,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 8);
	}, [results, games]);

	const winRateByGame = useMemo(() => {
		const stats: Record<string, { wins: number; total: number }> = {};

		results.forEach((r) => {
			r.playerResults.forEach((pr) => {
				if (!stats[r.gameId]) stats[r.gameId] = { wins: 0, total: 0 };
				if (pr.isWinner || pr.rank === 1) stats[r.gameId].wins++;
				stats[r.gameId].total++;
			});
		});

		return Object.entries(stats)
			.map(([gameId, { wins, total }]) => ({
				name: games.find((g) => g.id === gameId)?.name || "Unknown",
				winRate: Math.round((wins / total) * 100),
			}))
			.sort((a, b) => b.winRate - a.winRate)
			.slice(0, 8);
	}, [results, games]);

	const topWinningPlayers = useMemo(() => {
		const playerWinCounts: Record<string, number> = {};

		results.forEach((result) => {
			result.playerResults.forEach((pr) => {
				if (pr.isWinner || pr.rank === 1) {
					playerWinCounts[pr.playerId] = (playerWinCounts[pr.playerId] || 0) + 1;
				}
			});
		});

		return Object.entries(playerWinCounts)
			.map(([playerId, winCount]) => {
				const player = players.find((p) => p.id === playerId);
				const name = player?.preferredName || `${player?.firstName} ${player?.lastName}`;
				return { name, winCount };
			})
			.filter((p) => !!p.name)
			.sort((a, b) => b.winCount - a.winCount)
			.slice(0, 10); // top 10
	}, [results, players]);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-3">
				<StatCard title="Games Played" value={totalGamesPlayed.toString()} icon={<Gamepad2 size={20} />} />
				<StatCard title="Players Involved" value={totalPlayersInvolved.toString()} icon={<Users size={20} />} />
				<StatCard title="Total Events" value={totalEvents.toString()} icon={<Calendar size={20} />} />
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<ChartCard title="Most Played Games">
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={mostPlayedGames} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
							<XAxis
								dataKey="name"
								interval={0}
								tick={({ x, y, payload }) => (
									<text x={x} y={y + 10} textAnchor="middle" fill="#ccc" fontSize={12}>
										{payload.value}
									</text>
								)}
							/>
							<YAxis tick={{ fontSize: 12, fill: "#ccc" }} allowDecimals={false} />
							<Tooltip content={<CustomTooltip suffix="plays" />} />
							<Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#4F46E5" />
						</BarChart>
					</ResponsiveContainer>
				</ChartCard>

				<ChartCard title="Win Rate by Game">
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={winRateByGame} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
							<XAxis
								dataKey="name"
								interval={0}
								tick={({ x, y, payload }) => (
									<text x={x} y={y + 10} textAnchor="middle" fill="#ccc" fontSize={12}>
										{payload.value}
									</text>
								)}
							/>
							<YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#ccc" }} unit="%" />
							<Tooltip content={<CustomTooltip suffix="% win rate" />} />
							<Bar dataKey="winRate" radius={[4, 4, 0, 0]} fill="#10B981" />
						</BarChart>
					</ResponsiveContainer>
				</ChartCard>

				<ChartCard title="Top Winning Players">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							layout="vertical"
							data={topWinningPlayers}
							margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
						>
							<XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#ccc" }} />
							<YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#ccc" }} />
							<Tooltip
								cursor={{ fill: "rgba(255,255,255,0.05)" }}
								content={<CustomTooltip suffix="wins" />}
							/>
							<Bar dataKey="winCount" fill="#F59E0B" radius={[0, 4, 4, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</ChartCard>
			</div>
		</div>
	);
};
