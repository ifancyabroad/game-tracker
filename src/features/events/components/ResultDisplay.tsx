import { Award, Edit, Frown, Gamepad2, Hash, Trash2 } from "lucide-react";
import type { IGame } from "features/games/types";
import type { IPlayer } from "features/players/types";
import type { IResult, IPlayerResult } from "features/events/types";
import { Avatar } from "common/components/Avatar";

interface IResultDisplayProps {
	result: IResult;
	games: IGame[];
	players: IPlayer[];
	canEdit?: boolean;
	onEdit: (result: IResult) => void;
	onDelete: (resultId: string) => void;
}

export const ResultDisplay: React.FC<IResultDisplayProps> = ({ result, games, players, canEdit, onEdit, onDelete }) => {
	const game = games.find((g) => g.id === result.gameId);

	const withPlayer = (pr: IPlayerResult) => {
		const p = players.find((pl) => pl.id === pr.playerId);
		const full = p ? `${p.firstName} ${p.lastName}` : "Unknown";
		const name = p?.preferredName ?? full;
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

	return (
		<div className="rounded-xl border border-gray-700 bg-[var(--color-surface)] p-4 shadow-sm">
			<div className="mb-3 flex items-start justify-between gap-2">
				<div className="flex min-w-0 items-center gap-2">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/30">
						<Gamepad2 className="h-5 w-5 text-[var(--color-primary)]" />
					</div>
					<div className="min-w-0">
						<p className="truncate text-sm font-semibold text-white">{game?.name ?? "Unknown Game"}</p>
						<p className="text-xs text-gray-400">
							{rows.length} {rows.length === 1 ? "player" : "players"}
						</p>
					</div>
				</div>

				{canEdit && (
					<div className="flex items-center gap-1">
						<button
							onClick={() => onEdit(result)}
							className="rounded-lg border border-gray-700 bg-black/20 p-2 text-gray-200 hover:bg-[var(--color-primary)]/10"
							title="Edit Result"
						>
							<Edit size={16} />
						</button>
						<button
							onClick={() => onDelete(result.id)}
							className="rounded-lg border border-gray-700 bg-black/20 p-2 text-red-300 hover:bg-red-500/20"
							title="Delete Result"
						>
							<Trash2 size={16} />
						</button>
					</div>
				)}
			</div>

			<div className="w-full overflow-x-auto">
				<table className="w-full text-left text-sm text-gray-300">
					<thead className="border-b border-gray-700 bg-black/20 text-xs text-gray-400 uppercase">
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
							<tr key={r.playerId} className="border-b border-gray-700 last:border-b-0">
								<td className="py-2 pr-2 sm:pr-4">
									<div className="flex items-center gap-3">
										<Avatar
											src={r.player?.pictureUrl || undefined}
											name={r.displayName}
											size={28}
										/>
										<div className="max-w-[50vw] min-w-0 leading-tight sm:max-w-none">
											<div className="truncate text-white">{r.displayName}</div>
											{r.player &&
												r.player.preferredName &&
												r.player.preferredName !== r.fullName && (
													<div className="hidden truncate text-xs text-gray-400 sm:block">
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
												<Award className="h-4 w-4 align-middle text-yellow-500" />
											) : null}
										</span>
									</div>
								</td>

								<td className="px-2 py-2 text-center whitespace-nowrap sm:px-4">
									{r.isWinner ? (
										<Award className="mx-auto h-4 w-4 text-yellow-500" />
									) : (
										<span className="text-gray-500">—</span>
									)}
								</td>
								<td className="px-2 py-2 text-center whitespace-nowrap sm:px-4">
									{r.isLoser ? (
										<Frown className="mx-auto h-4 w-4 text-red-500" />
									) : (
										<span className="text-gray-500">—</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
