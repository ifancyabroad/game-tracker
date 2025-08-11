import React, { useMemo } from "react";
import { usePlayers } from "features/players/context/PlayersContext";
import { useResults } from "features/events/context/ResultsContext";
import type { IPlayer } from "features/players/types";
import { Avatar } from "common/components/Avatar";
import { Trophy, Target, Award, Gamepad2 } from "lucide-react";

interface RowStat {
	player: IPlayer | undefined;
	playerId: string;
	wins: number;
	games: number;
	winRate: number;
}

const formatPct = (n: number) => `${Math.round(n * 100)}%`;

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

export const HomePage: React.FC = () => {
	const { players } = usePlayers();
	const { results } = useResults();

	const leaderboard: RowStat[] = useMemo(() => {
		const stats: Record<string, { wins: number; games: number }> = {};
		results.forEach((r) => {
			r.playerResults.forEach((pr) => {
				const id = pr.playerId;
				if (!stats[id]) stats[id] = { wins: 0, games: 0 };
				stats[id].games += 1;
				if (pr.isWinner) stats[id].wins += 1;
			});
		});

		const rows: RowStat[] = Object.entries(stats).map(([playerId, s]) => ({
			playerId,
			player: players.find((p) => p.id === playerId),
			wins: s.wins,
			games: s.games,
			winRate: s.games > 0 ? s.wins / s.games : 0,
		}));

		rows.sort((a, b) => {
			if (b.wins !== a.wins) return b.wins - a.wins;
			if (b.winRate !== a.winRate) return b.winRate - a.winRate;
			if (b.games !== a.games) return b.games - a.games;
			const an = (a.player?.preferredName || a.player?.firstName || "").toLowerCase();
			const bn = (b.player?.preferredName || b.player?.firstName || "").toLowerCase();
			return an.localeCompare(bn);
		});

		return rows;
	}, [players, results]);

	const mostGames = useMemo(
		() => (leaderboard[0] ? leaderboard.slice().sort((a, b) => b.games - a.games)[0] : undefined),
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
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<FeaturedCard
					label="Most Wins"
					player={mostWins?.player}
					value={mostWins ? `${mostWins.wins} wins` : "—"}
					icon={<Award className="h-4 w-4 text-[var(--color-primary)]" />}
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
					label="Most Games Played"
					player={mostGames?.player}
					value={mostGames ? `${mostGames.games} games` : "—"}
					icon={<Gamepad2 className="h-4 w-4 text-[var(--color-primary)]" />}
				/>
			</div>

			<div className="overflow-hidden rounded-xl border border-gray-700 bg-[var(--color-surface)]">
				<div className="border-b border-gray-700 px-4 py-3">
					<h2 className="text-base font-semibold text-white">Leaderboard</h2>
					<p className="text-xs text-gray-400">Sorted by total wins</p>
				</div>

				{!hasData ? (
					<div className="px-6 py-10 text-center text-sm text-gray-400">
						No results yet. Play some games to populate the board!
					</div>
				) : (
					<table className="min-w-full text-sm">
						<thead className="bg-black/20 text-left text-gray-300">
							<tr>
								<th className="w-16 px-4 py-3 font-medium">Rank</th>
								<th className="px-4 py-3 font-medium">Player</th>
								<th className="px-4 py-3 text-center font-medium">Win %</th>
								<th className="px-4 py-3 text-center font-medium">Games</th>
								<th className="px-4 py-3 text-center font-medium">Wins</th>
							</tr>
						</thead>
						<tbody>
							{leaderboard.map((row, idx) => {
								const rank = idx + 1;
								const trophy = rankTrophy(rank);
								return (
									<tr
										key={row.playerId}
										className={`${rowBg(rank)} border-b border-gray-700 transition-colors last:border-b-0 hover:bg-white/5`}
										title={`${row.player?.preferredName ?? "Unknown"} · ${formatPct(row.winRate)} over ${row.games} games`}
									>
										<td className="px-4 py-3 align-middle">
											{trophy ? trophy : <span className="text-gray-300">{rank}</span>}
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-3">
												<Avatar
													src={row.player?.pictureUrl || undefined}
													name={row.player?.preferredName ?? row.player?.firstName ?? "?"}
													size={40}
												/>
												<div className="leading-tight">
													<div className="font-medium text-white">
														{row.player?.preferredName ??
															row.player?.firstName ??
															"Unknown"}
													</div>
												</div>
											</div>
										</td>
										<td className="px-4 py-3 text-center text-gray-200 tabular-nums">
											{formatPct(row.winRate)}
										</td>
										<td className="px-4 py-3 text-center text-gray-200 tabular-nums">
											{row.games}
										</td>
										<td className="px-4 py-3 text-center font-semibold text-white tabular-nums">
											{row.wins}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

const FeaturedCard: React.FC<{
	label: string;
	player?: IPlayer;
	value: string;
	icon: React.ReactNode;
}> = ({ label, player, value, icon }) => {
	const name = player?.preferredName ?? player?.firstName ?? "Unknown";
	return (
		<div className="group relative flex items-center gap-4 rounded-xl border border-gray-700 bg-[var(--color-surface)] p-4 shadow-sm transition-transform hover:-translate-y-0.5">
			<div className="relative">
				<Avatar src={player?.pictureUrl || undefined} name={name} size={48} />
			</div>
			<div className="min-w-0">
				<p className="text-[11px] tracking-wide text-gray-400 uppercase">{label}</p>
				<p className="truncate text-sm font-semibold text-white">{name}</p>
				<p className="flex items-center gap-1 text-xs text-gray-300">
					{icon}
					{value}
				</p>
			</div>
		</div>
	);
};

export default HomePage;
