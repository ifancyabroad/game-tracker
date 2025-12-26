import { Trophy, Medal, Award } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { PlayerWithData } from "features/players/types";
import { Avatar } from "common/components";
import { formatPct } from "common/utils/helpers";
import { ChampionshipBadge } from "./ChampionshipBadge";

const getRankIcon = (rank: number) => {
	if (rank === 1) return <Trophy className="h-4 w-4 shrink-0 text-yellow-500 sm:h-5 sm:w-5" />;
	if (rank === 2) return <Medal className="h-4 w-4 shrink-0 text-slate-400 sm:h-5 sm:w-5" />;
	if (rank === 3) return <Award className="h-4 w-4 shrink-0 text-amber-600 sm:h-5 sm:w-5" />;
	return (
		<span className="inline-flex text-xs font-semibold text-[var(--color-text-secondary)] sm:text-sm">{rank}</span>
	);
};

const getRankBorderColor = (rank: number) => {
	if (rank === 1) return "bg-yellow-500";
	if (rank === 2) return "bg-slate-400";
	if (rank === 3) return "bg-amber-600";
	return "";
};

export const LeaderboardTable: React.FC<{
	leaderboard: PlayerWithData[];
	championships: Map<string, number[]>;
}> = ({ leaderboard, championships }) => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [scrollState, setScrollState] = useState({ isScrolled: false, canScrollRight: false });

	useEffect(() => {
		const handleScroll = () => {
			if (!scrollRef.current) return;
			const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
			setScrollState({
				isScrolled: scrollLeft > 0,
				canScrollRight: scrollLeft < scrollWidth - clientWidth - 1,
			});
		};

		const scrollEl = scrollRef.current;
		if (scrollEl) {
			handleScroll(); // Initial check
			scrollEl.addEventListener("scroll", handleScroll);
			// Also check on resize
			window.addEventListener("resize", handleScroll);
			return () => {
				scrollEl.removeEventListener("scroll", handleScroll);
				window.removeEventListener("resize", handleScroll);
			};
		}
	}, []);

	return (
		<div className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
			<div ref={scrollRef} className="overflow-x-auto">
				<table className="w-full border-separate border-spacing-0 text-sm">
					<thead className="text-left text-xs text-[var(--color-text-secondary)]">
						<tr className="bg-[var(--color-accent)]">
							<th className="sticky left-0 z-20 w-48 min-w-[12rem] px-3 py-2 whitespace-nowrap sm:px-4">
								<div className="absolute inset-0 -z-10 bg-[var(--color-accent)]" />
								{scrollState.isScrolled && (
									<div className="absolute top-0 right-0 h-full w-px bg-[var(--color-border)]" />
								)}
								Player
							</th>
							<th className="px-3 py-2 text-center whitespace-nowrap sm:px-4">Points</th>
							<th className="px-3 py-2 text-center whitespace-nowrap sm:px-4">Wins</th>
							<th className="px-3 py-2 text-center whitespace-nowrap sm:px-4">Games</th>
							<th className="px-3 py-2 text-center whitespace-nowrap sm:px-4">Win Rate</th>
						</tr>
					</thead>
					<tbody>
						{leaderboard.map((row, idx) => {
							const rank = idx + 1;
							const rankBorderColor = getRankBorderColor(rank);
							const championshipYears = championships.get(row.id) || [];

							return (
								<tr
									key={row.id}
									className="group cursor-pointer transition-colors hover:bg-[var(--color-hover)]"
									onClick={() => (window.location.href = `/players/${row.id}`)}
								>
									{/* Player Column - Sticky (includes rank) */}
									<td className="sticky left-0 z-10 w-48 min-w-[12rem] border-b border-[var(--color-border)] px-3 py-3 sm:px-4">
										{/* Rank indicator line */}
										{rankBorderColor && (
											<div className={`absolute top-0 left-0 h-full w-1 ${rankBorderColor}`} />
										)}
										{/* Sticky background */}
										<div
											className={`absolute inset-x-0 top-0 bottom-0 transition-colors duration-200 group-hover:bg-[var(--color-hover)] ${
												scrollState.isScrolled
													? "bg-[var(--color-accent)]"
													: "bg-[var(--color-surface)]"
											} -z-10`}
										/>
										<div className="flex items-center gap-3">
											<div className="flex h-8 w-8 shrink-0 items-center justify-center">
												{getRankIcon(rank)}
											</div>
											<Avatar src={row.pictureUrl || undefined} name={row.data.name} size={32} />
											<div className="min-w-0 flex-1">
												<div className="truncate text-sm font-semibold text-[var(--color-text)]">
													{row.data.name}
												</div>
												{championshipYears.length > 0 && (
													<div className="mt-0.5 flex flex-wrap items-center gap-0.5">
														{championshipYears.map((year) => (
															<ChampionshipBadge key={year} year={year} />
														))}
													</div>
												)}
											</div>
										</div>
										{/* Scroll indicator border */}
										{scrollState.isScrolled && (
											<div className="absolute top-0 right-0 h-full w-px bg-[var(--color-border)]" />
										)}
									</td>

									{/* Points Column */}
									<td className="border-b border-[var(--color-border)] px-3 py-3 text-center tabular-nums sm:px-4">
										<span className="text-base font-bold text-[var(--color-text)] sm:text-lg">
											{row.data.points}
										</span>
									</td>

									{/* Wins Column */}
									<td className="border-b border-[var(--color-border)] px-3 py-3 text-center text-[var(--color-text)] tabular-nums sm:px-4">
										{row.data.wins}
									</td>

									{/* Games Column */}
									<td className="border-b border-[var(--color-border)] px-3 py-3 text-center text-[var(--color-text)] tabular-nums sm:px-4">
										{row.data.games}
									</td>

									{/* Win Rate Column */}
									<td className="border-b border-[var(--color-border)] px-3 py-3 text-center text-[var(--color-text)] tabular-nums sm:px-4">
										{formatPct(row.data.winRate)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Scroll gradient indicator */}
			<div
				className={`pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-gray-200 via-gray-200/60 to-transparent transition-opacity duration-300 dark:from-[var(--color-surface)] dark:via-[var(--color-surface)]/80 ${
					scrollState.canScrollRight ? "opacity-100" : "opacity-0"
				}`}
			/>
		</div>
	);
};
