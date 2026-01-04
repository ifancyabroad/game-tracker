import { Award, Edit, Frown, Hash, Trash2 } from "lucide-react";
import type { IGame } from "features/games/types";
import type { IPlayer } from "features/players/types";
import type { IResult, IPlayerResult } from "features/events/types";
import { Avatar, IconButton, Card } from "common/components";
import { getDisplayName, getFullName } from "features/players/utils/helpers";
import { useNavigate, Link } from "react-router";
import { GameTypeIcon } from "features/games/components/GameTypeIcon";
import { pluralize } from "common/utils/helpers";

interface IResultDisplayProps {
	result: IResult;
	gameById: Map<string, IGame>;
	playerById: Map<string, IPlayer>;
	canEdit?: boolean;
	onEdit: (result: IResult) => void;
	onDelete: (resultId: string) => void;
}

export const ResultDisplay: React.FC<IResultDisplayProps> = ({
	result,
	gameById,
	playerById,
	canEdit,
	onEdit,
	onDelete,
}) => {
	const navigate = useNavigate();

	const game = gameById.get(result.gameId);

	const withPlayer = (pr: IPlayerResult) => {
		const p = playerById.get(pr.playerId);
		const full = getFullName(p);
		const name = getDisplayName(p);
		return { ...pr, player: p, displayName: name, fullName: full };
	};

	const rows = result.playerResults.map(withPlayer).sort((a, b) => {
		const aw = a.isWinner ? 1 : 0;
		const bw = b.isWinner ? 1 : 0;
		if (bw !== aw) return bw - aw;
		const ar = a.rank ?? Number.POSITIVE_INFINITY;
		const br = b.rank ?? Number.POSITIVE_INFINITY;
		if (ar !== br) return ar - br;
		return a.displayName.localeCompare(b.displayName);
	});

	const handleNavigateToPlayer = (playerId: string) => {
		navigate(`/players/${playerId}`);
	};

	return (
		<Card className="p-3 sm:p-4">
			<div className="mb-2.5 flex items-start justify-between gap-2 sm:mb-3">
				<div className="flex min-w-0 items-center gap-2">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent)]">
						{game && <GameTypeIcon type={game.type} className="h-5 w-5 text-[var(--color-primary)]" />}
					</div>
					<div className="min-w-0">
						{game ? (
							<Link
								to={`/games/${result.gameId}`}
								className="block truncate text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)]"
							>
								{game.name}
							</Link>
						) : (
							<p className="truncate text-sm font-semibold text-[var(--color-text)]">Unknown Game</p>
						)}
						<p className="text-xs text-[var(--color-text-secondary)]">
							{rows.length} {pluralize(rows.length, "player")}
						</p>
					</div>
				</div>
				{canEdit && (
					<div className="flex items-center gap-1">
						<IconButton onClick={() => onEdit(result)} icon={<Edit />} title="Edit Result" />
						<IconButton
							onClick={() => onDelete(result.id)}
							icon={<Trash2 />}
							variant="danger"
							title="Delete Result"
						/>
					</div>
				)}
			</div>

			<div className="w-full overflow-x-auto">
				<table className="w-full text-left text-sm text-[var(--color-text)]">
					<thead className="border-b border-[var(--color-border)] bg-[var(--color-accent)] text-xs text-[var(--color-text-secondary)] uppercase">
						<tr>
							<th className="px-2 py-2 sm:px-4">Player</th>
							<th className="px-2 py-2 text-center sm:w-24 sm:px-4">
								<span className="inline sm:hidden" aria-hidden>
									<Hash className="mx-auto h-4 w-4" />
								</span>
								<span className="hidden sm:inline">Rank</span>
							</th>
							<th className="px-2 py-2 text-center sm:w-28 sm:px-4">
								<span className="inline sm:hidden" aria-hidden>
									<Award className="mx-auto h-4 w-4" />
								</span>
								<span className="hidden sm:inline">Winner</span>
							</th>
							<th className="px-2 py-2 text-center sm:w-28 sm:px-4">
								<span className="inline sm:hidden" aria-hidden>
									<Frown className="mx-auto h-4 w-4" />
								</span>
								<span className="hidden sm:inline">Loser</span>
							</th>
						</tr>
					</thead>

					<tbody>
						{rows.map((r) => (
							<tr
								key={r.playerId}
								className="cursor-pointer border-b border-[var(--color-border)] last:border-b-0 hover:hover:bg-[var(--color-hover)]"
								onClick={() => handleNavigateToPlayer(r.playerId)}
							>
								<td className="p-2 sm:pr-4">
									<div className="flex items-center gap-3">
										<Avatar
											src={r.player?.pictureUrl || undefined}
											name={r.displayName}
											size={28}
										/>
										<div className="max-w-[50vw] min-w-0 leading-tight sm:max-w-none">
											<div className="truncate text-[var(--color-text)]">{r.displayName}</div>
											{r.player &&
												r.player.preferredName &&
												r.player.preferredName !== r.fullName && (
													<div className="hidden truncate text-xs text-[var(--color-text-secondary)] sm:block">
														{r.fullName}
													</div>
												)}
										</div>
									</div>
								</td>
								<td className="px-2 py-2 text-center sm:px-4">
									<div className="inline-flex items-center justify-center gap-1">
										<span className="inline-block w-6 text-right font-mono tabular-nums">
											{r.rank ?? "—"}
										</span>
										<span className="inline-block w-4">
											{r.rank === 1 ? (
												<Award className="h-4 w-4 align-middle text-[var(--color-gold)]" />
											) : null}
										</span>
									</div>
								</td>

								<td className="px-2 py-2 text-center whitespace-nowrap sm:px-4">
									{r.isWinner ? (
										<Award className="mx-auto h-4 w-4 text-[var(--color-gold)]" />
									) : (
										<span className="text-[var(--color-text-muted)]">—</span>
									)}
								</td>
								<td className="px-2 py-2 text-center whitespace-nowrap sm:px-4">
									{r.isLoser ? (
										<Frown className="mx-auto h-4 w-4 text-[var(--color-danger)]" />
									) : (
										<span className="text-[var(--color-text-muted)]">—</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{result.notes && (
				<div className="mt-3 rounded-lg bg-[var(--color-accent)] p-2.5">
					<p className="text-xs text-[var(--color-text-secondary)] italic">{result.notes}</p>
				</div>
			)}
		</Card>
	);
};
