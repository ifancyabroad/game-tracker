import React, { useMemo } from "react";
import { usePlayers } from "features/players/context/PlayersContext";
import { useResults } from "features/events/context/ResultsContext";
import { Avatar } from "common/components/Avatar";
import { Trophy, Target, Award, Star } from "lucide-react";
import { useGames } from "features/games/context/GamesContext";
import { sortLeaderboard } from "features/events/utils/stats";
import { usePlayerStatsMap } from "features/events/utils/hooks";
import { useNavigate } from "react-router";
import { formatPct } from "common/utils/helpers";
import { getDisplayName } from "features/players/utils/helpers";
import { FeaturedCard } from "features/leaderboard/components/FeaturedCard";

const rankTrophy = (rank: number) => {
	if (rank === 1) return <Trophy aria-label="1st" className="h-5 w-5 text-yellow-400" />;
	if (rank === 2) return <Trophy aria-label="2nd" className="h-5 w-5 text-slate-300" />;
	if (rank === 3) return <Trophy aria-label="3rd" className="h-5 w-5 text-amber-600" />;
	return null;
};

const rowBg = (rank: number) => {
	if (rank === 1) return "bg-yellow-500/5";
	if (rank === 2) return "bg-slate-500/5";
	if (rank === 3) return "bg-amber-500/5";
	return "";
};

const pointsTint = (rank: number) => {
	if (rank === 1) return "before:bg-yellow-500/10";
	if (rank === 2) return "before:bg-slate-500/10";
	if (rank === 3) return "before:bg-amber-500/10";
	return "before:bg-black/20";
};

export const HomePage: React.FC = () => {
	const { players } = usePlayers();
	const { results } = useResults();
	const { games } = useGames();
	const statsMap = usePlayerStatsMap(players, results, games);
	const navigate = useNavigate();

	const leaderboard = useMemo(() => {
		const rows = players
			.map((p) => ({ player: p, playerId: p.id, ...statsMap.get(p.id)! }))
			.filter((r) => r.games > 0);
		return sortLeaderboard(rows);
	}, [players, statsMap]);

	const mostPoints = useMemo(
		() => (leaderboard[0] ? leaderboard.slice().sort((a, b) => b.points - a.points)[0] : undefined),
		[leaderboard],
	);
	const mostWins = useMemo(
		() => (leaderboard[0] ? leaderboard.slice().sort((a, b) => b.wins - a.wins)[0] : undefined),
		[leaderboard],
	);
	const bestWinRateMin5 = useMemo(() => {
		const eligible = leaderboard.filter((r) => r.games >= 5);
		if (!eligible.length) return undefined;
		return eligible.sort((a, b) => b.winRate - a.winRate || b.games - a.games)[0];
	}, [leaderboard]);

	const hasData = leaderboard.length > 0;

	return (
		<div className="mx-auto grid max-w-6xl gap-8">
			<div className="hidden gap-4 sm:grid-cols-2 lg:grid lg:grid-cols-3">
				<FeaturedCard
					label="Current Leader"
					player={mostPoints?.player}
					value={mostPoints ? `${mostPoints.points} points` : "—"}
					icon={<Star className="h-4 w-4 text-[var(--color-primary)]" />}
				/>
				<FeaturedCard
					label="Best Win Rate (min 5)"
					player={bestWinRateMin5?.player}
					value={
						bestWinRateMin5 ? `${formatPct(bestWinRateMin5.winRate)} · ${bestWinRateMin5.games} games` : "—"
					}
					icon={<Target className="h-4 w-4 text-[var(--color-primary)]" />}
				/>
				<FeaturedCard
					label="Most Wins"
					player={mostWins?.player}
					value={mostWins ? `${mostWins.wins} wins` : "—"}
					icon={<Award className="h-4 w-4 text-[var(--color-primary)]" />}
				/>
			</div>

			<div className="overflow-hidden rounded-xl border border-gray-700 bg-[var(--color-surface)]">
				<div className="border-b border-gray-700 px-4 py-3">
					<h2 className="text-base font-semibold text-white">Leaderboard</h2>
					<p className="text-xs text-gray-400">Sorted by total points</p>
				</div>

				{!hasData ? (
					<div className="px-6 py-10 text-center text-sm text-gray-400">
						No results yet. Play some games to populate the board!
					</div>
				) : (
					<div className="relative overflow-x-auto">
						<table className="w-full min-w-[720px] text-sm">
							<thead className="bg-black/20 text-left text-gray-300">
								<tr>
									<th className="w-16 px-4 py-3 font-medium">Rank</th>
									<th className="px-4 py-3 font-medium">Player</th>
									<th className="px-4 py-3 text-center font-medium">Played</th>
									<th className="px-4 py-3 text-center font-medium">Wins</th>
									<th className="px-4 py-3 text-center font-medium">Win %</th>
									<th className="sticky right-0 z-20 bg-neutral-950 px-4 py-3 text-center font-medium shadow-[inset_1px_0_0_0_rgba(148,163,184,0.2)]">
										Points
									</th>
								</tr>
							</thead>
							<tbody>
								{leaderboard.map((row, idx) => {
									const rank = idx + 1;
									const trophy = rankTrophy(rank);

									const handleNavigate = () => {
										navigate(`/players/${row.playerId}`);
									};

									return (
										<tr
											key={row.playerId}
											className={`${rowBg(rank)} group cursor-pointer border-b border-gray-700 transition-colors last:border-b-0 hover:bg-white/5`}
											title={`${getDisplayName(row.player)} · ${formatPct(row.winRate)} over ${row.games} games`}
											onClick={handleNavigate}
										>
											<td className="px-4 py-3 align-middle">
												{trophy ? trophy : <span className="text-gray-300">{rank}</span>}
											</td>
											<td className="px-4 py-3">
												<div className="flex items-center gap-3">
													<Avatar
														src={row.player?.pictureUrl || undefined}
														name={getDisplayName(row.player)}
														size={40}
													/>
													<div className="leading-tight">
														<div className="font-medium text-white">
															{getDisplayName(row.player)}
														</div>
													</div>
												</div>
											</td>
											<td className="px-4 py-3 text-center text-gray-200 tabular-nums">
												{row.games}
											</td>
											<td className="px-4 py-3 text-center text-gray-200 tabular-nums">
												{row.wins}
											</td>
											<td className="px-4 py-3 text-center text-gray-200 tabular-nums">
												{formatPct(row.winRate)}
											</td>

											<td
												className={`sticky right-0 z-10 bg-[var(--color-surface)] px-4 py-3 text-center font-semibold text-white tabular-nums shadow-[inset_1px_0_0_0_rgba(148,163,184,0.2)] before:absolute before:inset-0 before:z-0 before:content-[''] ${pointsTint(rank)} after:absolute after:inset-0 after:z-10 after:bg-white/5 after:opacity-0 after:transition-opacity after:content-[''] group-hover:after:opacity-100`}
											>
												<span className="relative z-20">{row.points}</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;
