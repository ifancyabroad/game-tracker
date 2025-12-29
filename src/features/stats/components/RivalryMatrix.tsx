import { Card, Avatar, EmptyState } from "common/components";
import { Swords } from "lucide-react";
import { Link } from "react-router";
import type { TopRivalry } from "features/stats/utils/calculations/rivalries";

interface RivalryMatrixProps {
	rivalries: TopRivalry[];
	title: string;
	description: string;
}

export const RivalryMatrix: React.FC<RivalryMatrixProps> = ({ rivalries, title, description }) => {
	if (rivalries.length === 0) {
		return (
			<Card className="p-4">
				<div className="mb-3 flex items-center gap-2">
					<Swords size={20} className="text-[var(--color-primary)]" />
					<h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
				</div>
				<EmptyState>
					<Swords size={32} className="mx-auto mb-2 text-[var(--color-text-secondary)]" />
					<p>No rivalries found</p>
					<p className="text-xs">Players need at least 5 games together to establish a rivalry</p>
				</EmptyState>
			</Card>
		);
	}

	return (
		<Card className="overflow-hidden">
			<div className="border-b border-[var(--color-border)] p-3 sm:p-4">
				<h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
				<p className="text-xs text-[var(--color-text-secondary)]">{description}</p>
			</div>

			<div className="divide-y divide-[var(--color-border)]">
				{rivalries.map((rivalry) => {
					const player1WinPct = rivalry.totalGames > 0 ? (rivalry.player1Wins / rivalry.totalGames) * 100 : 0;
					const player2WinPct = rivalry.totalGames > 0 ? (rivalry.player2Wins / rivalry.totalGames) * 100 : 0;
					const neutralPct = 100 - player1WinPct - player2WinPct;

					return (
						<div
							key={`${rivalry.player1Id}-${rivalry.player2Id}`}
							className="p-3 transition-colors hover:bg-[var(--color-hover)] sm:p-4"
						>
							{/* Game Count - Mobile Only */}
							<div className="mb-2 text-center sm:hidden">
								<div className="inline-flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
									<Swords size={14} />
									<span>{rivalry.totalGames} games</span>
									<Swords size={14} />
								</div>
							</div>

							{/* Players and Stats */}
							<div className="mb-3 grid grid-cols-2 items-center gap-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-3">
								<Link to={`/players/${rivalry.player1Id}`} className="flex items-center gap-2">
									<Avatar src={rivalry.player1PictureUrl} name={rivalry.player1Name} size={40} />
									<div className="min-w-0">
										<div className="truncate text-sm font-semibold text-[var(--color-text)]">
											{rivalry.player1Name}
										</div>
										<div className="text-xs text-[var(--color-text-secondary)]">
											{rivalry.player1Wins} wins · {Math.round(player1WinPct)}%
										</div>
									</div>
								</Link>

								<div className="hidden shrink-0 items-center gap-1 sm:flex sm:gap-2">
									<Swords size={16} className="text-[var(--color-text-secondary)]" />
									<div className="text-center">
										<div className="text-xs whitespace-nowrap text-[var(--color-text-secondary)]">
											{rivalry.totalGames} games
										</div>
									</div>
									<Swords size={16} className="text-[var(--color-text-secondary)]" />
								</div>

								<Link
									to={`/players/${rivalry.player2Id}`}
									className="flex items-center justify-end gap-2"
								>
									<div className="min-w-0 text-right">
										<div className="truncate text-sm font-semibold text-[var(--color-text)]">
											{rivalry.player2Name}
										</div>
										<div className="text-xs text-[var(--color-text-secondary)]">
											{rivalry.player2Wins} wins · {Math.round(player2WinPct)}%
										</div>
									</div>
									<Avatar src={rivalry.player2PictureUrl} name={rivalry.player2Name} size={40} />
								</Link>
							</div>

							{/* Win Distribution Bar */}
							<div className="flex h-2 overflow-hidden rounded-full bg-[var(--color-accent)]">
								<div
									className="h-full transition-all"
									style={{
										width: `${player1WinPct}%`,
										backgroundColor: rivalry.player1Color,
									}}
								/>
								{neutralPct > 0 && (
									<div
										className="h-full"
										style={{
											width: `${neutralPct}%`,
										}}
									/>
								)}
								<div
									className="h-full transition-all"
									style={{
										width: `${player2WinPct}%`,
										backgroundColor: rivalry.player2Color,
									}}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</Card>
	);
};
