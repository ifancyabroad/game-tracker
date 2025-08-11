import { XCircle, Award, Trash2, Edit, Gamepad2 } from "lucide-react";
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
		// Winners first
		const aw = a.isWinner ? 1 : 0;
		const bw = b.isWinner ? 1 : 0;
		if (bw !== aw) return bw - aw;
		// Then by rank ascending (nulls last)
		const ar = a.rank ?? Number.POSITIVE_INFINITY;
		const br = b.rank ?? Number.POSITIVE_INFINITY;
		if (ar !== br) return ar - br;
		// Then by name
		return a.displayName.localeCompare(b.displayName);
	});

	const winners = rows.filter((r) => r.isWinner).length;

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
							{winners} {winners === 1 ? "winner" : "winners"}
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
							<th className="px-4 py-2">Player</th>
							<th className="w-24 px-2 py-2 text-center">Rank</th>
							<th className="w-28 px-2 py-2 text-center">Winner</th>
							<th className="w-28 px-2 py-2 text-center">Loser</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((r) => {
							return (
								<tr key={r.playerId} className="border-b border-gray-700 last:border-b-0">
									<td className="py-2 pr-4">
										<div className="flex items-center gap-3">
											<Avatar
												src={r.player?.pictureUrl || undefined}
												name={r.displayName}
												size={28}
											/>
											<div className="min-w-0 leading-tight">
												<div className="truncate text-white">{r.displayName}</div>
												{r.player &&
													r.player.preferredName &&
													r.player.preferredName !== r.fullName && (
														<div className="truncate text-xs text-gray-400">
															{r.fullName}
														</div>
													)}
											</div>
										</div>
									</td>
									<td className="px-2 py-2 text-center tabular-nums">
										{r.rank ?? "—"}
										{r.rank === 1 && (
											<Award className="ml-1 inline h-4 w-4 align-middle text-yellow-500" />
										)}
									</td>
									<td className="px-2 py-2 text-center">
										{r.isWinner ? (
											<Award className="mx-auto h-4 w-4 text-yellow-500" />
										) : (
											<span className="text-gray-500">—</span>
										)}
									</td>
									<td className="px-2 py-2 text-center">
										{r.isLoser ? (
											<XCircle className="mx-auto h-4 w-4 text-red-500" />
										) : (
											<span className="text-gray-500">—</span>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};
