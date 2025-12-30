import React from "react";
import { Link } from "react-router";
import { Trophy, BarChart3, Calendar, TrendingUp, TrendingDown, Swords } from "lucide-react";
import { usePlayerLeaderboard } from "features/leaderboard/utils/hooks";
import { useLastEventTopScorers, useLongestDrought } from "features/dashboard/utils/hooks";
import { useSortedEvents } from "features/events/utils/hooks";
import { useTopRivalries } from "features/stats/utils/hooks";
import { LeaderCard } from "features/dashboard/components/LeaderCard";
import { EventCard } from "features/dashboard/components/EventCard";
import { Card, EmptyState } from "common/components";
import { useGames } from "features/games/context/GamesContext";
import { getDisplayName } from "features/players/utils/helpers";
import { pluralize } from "common/utils/helpers";

export const HomePage: React.FC = () => {
	const { gameById } = useGames();

	// Leaderboard data (current year)
	const leaderboard = usePlayerLeaderboard();
	const topThree = leaderboard.slice(0, 3);

	// Recent activity
	const sortedEvents = useSortedEvents();
	const latestEvents = sortedEvents.slice(0, 3);

	// Insights
	const topScorers = useLastEventTopScorers();
	const longestDrought = useLongestDrought();
	const topRivalries = useTopRivalries();
	const topRivalry = topRivalries.length > 0 ? topRivalries[0] : null;

	const hasData = leaderboard.length > 0;

	return (
		<div className="mx-auto max-w-6xl">
			{!hasData ? (
				<EmptyState>
					<div className="flex flex-col items-center gap-3">
						<Trophy className="h-12 w-12 text-[var(--color-text-secondary)]" />
						<div>
							<p className="mb-1 font-semibold text-[var(--color-text)]">No events recorded yet</p>
							<p className="text-sm">
								Events and results will appear here once they're added to the system.
							</p>
						</div>
					</div>
				</EmptyState>
			) : (
				<div className="space-y-6 sm:space-y-8">
					{/* Current Year Leaders */}
					<section>
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-bold text-[var(--color-text)] sm:text-xl">
								Current Year Leaders
							</h2>
							<Link
								to="/leaderboard"
								className="text-sm font-medium text-[var(--color-primary)] hover:underline"
							>
								View All →
							</Link>
						</div>
						{topThree.length > 0 ? (
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{topThree.map((player, idx) => (
									<LeaderCard key={player.id} player={player} rank={idx + 1} />
								))}
							</div>
						) : (
							<Card className="p-6 text-center">
								<p className="text-sm text-[var(--color-text-secondary)]">No data for current year</p>
							</Card>
						)}
					</section>

					{/* Latest Events */}
					{latestEvents.length > 0 && (
						<section>
							<div className="mb-4 flex items-center justify-between">
								<h2 className="text-lg font-bold text-[var(--color-text)] sm:text-xl">Recent Events</h2>
								<Link
									to="/events"
									className="text-sm font-medium text-[var(--color-primary)] hover:underline"
								>
									View All →
								</Link>
							</div>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{latestEvents.map((event) => (
									<EventCard
										key={event.id}
										event={event}
										gameById={gameById}
										playerCount={event.playerIds?.length || 0}
									/>
								))}
							</div>
						</section>
					)}

					{/* Dynamic Insights */}
					<section>
						<h2 className="mb-4 text-lg font-bold text-[var(--color-text)] sm:text-xl">Highlights</h2>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{/* Top Scorer(s) from Last Event */}
							{topScorers.length > 0 && (
								<Card className="relative overflow-hidden border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent p-4">
									<div className="mb-3 inline-flex rounded-lg bg-green-500/20 p-2">
										<TrendingUp className="h-5 w-5 text-green-600" />
									</div>
									<h3 className="mb-3 font-semibold text-[var(--color-text)]">
										Last Event Top Scorer
									</h3>
									<div className="space-y-2">
										{topScorers.map((scorer, idx) => (
											<div key={idx} className="flex items-center justify-between">
												<span className="text-sm text-[var(--color-text)]">
													{getDisplayName(scorer.player)}
												</span>
												<span className="font-semibold text-green-600">
													{scorer.points} {pluralize(scorer.points, "point")}
												</span>
											</div>
										))}
									</div>
								</Card>
							)}

							{/* Longest Drought */}
							{longestDrought && (
								<Card className="relative overflow-hidden border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent p-4">
									<div className="mb-3 inline-flex rounded-lg bg-orange-500/20 p-2">
										<TrendingDown className="h-5 w-5 text-orange-600" />
									</div>
									<h3 className="mb-3 font-semibold text-[var(--color-text)]">Longest Drought</h3>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-sm text-[var(--color-text-secondary)]">Player</span>
											<span className="font-medium text-[var(--color-text)]">
												{getDisplayName(longestDrought.player)}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-[var(--color-text-secondary)]">
												Games Since Win
											</span>
											<span className="font-semibold text-orange-600">
												{longestDrought.gamesSinceWin}
											</span>
										</div>
									</div>
								</Card>
							)}

							{/* Top Rivalry */}
							{topRivalry && (
								<Card className="relative overflow-hidden border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent p-4">
									<div className="mb-3 inline-flex rounded-lg bg-purple-500/20 p-2">
										<Swords className="h-5 w-5 text-purple-600" />
									</div>
									<h3 className="mb-3 font-semibold text-[var(--color-text)]">Hottest Rivalry</h3>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-sm text-[var(--color-text-secondary)]">Players</span>
											<span className="text-sm font-medium text-[var(--color-text)]">
												{topRivalry.player1Name} vs {topRivalry.player2Name}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-[var(--color-text-secondary)]">
												Head-to-Head
											</span>
											<span className="font-semibold text-purple-600">
												{topRivalry.player1Wins}-{topRivalry.player2Wins}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-[var(--color-text-secondary)]">
												Games Played
											</span>
											<span className="font-medium text-[var(--color-text)]">
												{topRivalry.totalGames}
											</span>
										</div>
									</div>
								</Card>
							)}
						</div>
					</section>

					{/* Quick Navigation */}
					<section>
						<h2 className="mb-4 text-lg font-bold text-[var(--color-text)] sm:text-xl">Explore</h2>
						<div className="grid gap-4 sm:grid-cols-3">
							<Link to="/leaderboard">
								<Card
									variant="interactive"
									className="group relative overflow-hidden border-2 border-transparent p-5 transition-all hover:border-yellow-500/50 hover:bg-gradient-to-br hover:from-yellow-500/10 hover:to-transparent"
								>
									<div className="mb-3 inline-flex rounded-xl bg-yellow-500/20 p-3 transition-all group-hover:scale-110 group-hover:bg-yellow-500/30">
										<Trophy className="h-6 w-6 text-yellow-600" />
									</div>
									<h3 className="mb-1 text-lg font-bold text-[var(--color-text)]">Leaderboard</h3>
									<p className="text-sm text-[var(--color-text-secondary)]">
										View complete player rankings and stats
									</p>
								</Card>
							</Link>

							<Link to="/stats">
								<Card
									variant="interactive"
									className="group relative overflow-hidden border-2 border-transparent p-5 transition-all hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-transparent"
								>
									<div className="mb-3 inline-flex rounded-xl bg-blue-500/20 p-3 transition-all group-hover:scale-110 group-hover:bg-blue-500/30">
										<BarChart3 className="h-6 w-6 text-blue-600" />
									</div>
									<h3 className="mb-1 text-lg font-bold text-[var(--color-text)]">Stats</h3>
									<p className="text-sm text-[var(--color-text-secondary)]">
										Dive into detailed analytics and trends
									</p>
								</Card>
							</Link>

							<Link to="/events">
								<Card
									variant="interactive"
									className="group relative overflow-hidden border-2 border-transparent p-5 transition-all hover:border-indigo-500/50 hover:bg-gradient-to-br hover:from-indigo-500/10 hover:to-transparent"
								>
									<div className="mb-3 inline-flex rounded-xl bg-indigo-500/20 p-3 transition-all group-hover:scale-110 group-hover:bg-indigo-500/30">
										<Calendar className="h-6 w-6 text-indigo-600" />
									</div>
									<h3 className="mb-1 text-lg font-bold text-[var(--color-text)]">Events</h3>
									<p className="text-sm text-[var(--color-text-secondary)]">
										Browse all game nights and results
									</p>
								</Card>
							</Link>
						</div>
					</section>
				</div>
			)}
		</div>
	);
};

export default HomePage;
