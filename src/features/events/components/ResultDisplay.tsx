import { CheckCircle, XCircle, Award, Pencil, Trash2, Edit } from "lucide-react";
import type { IGame } from "features/games/types";
import type { IPlayer } from "features/players/types";
import type { IResult } from "features/events/types";

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

	const getPlayerName = (playerId: string): string => {
		const player = players.find((p) => p.id === playerId);
		if (!player) return "";
		return player.preferredName || `${player.firstName} ${player.lastName}`;
	};

	if (!game) {
		return <div className="text-red-500">Game not found for result.</div>;
	}

	return (
		<div key={result.id} className="rounded border border-gray-700 bg-gray-800 p-4">
			<div className="mb-3 flex items-center justify-between">
				<h4 className="text-md font-semibold text-[var(--color-primary)]">{game.name}</h4>
				{canEdit && (
					<div className="flex gap-2">
						<button
							onClick={() => onEdit(result)}
							className="rounded p-2 transition-colors hover:bg-blue-500/20"
							title="Edit"
						>
							<Edit size={18} className="text-blue-400" />
						</button>
						<button
							onClick={() => onDelete(result.id)}
							className="rounded p-2 transition-colors hover:bg-red-500/20"
							title="Delete"
						>
							<Trash2 size={18} className="text-red-400" />
						</button>
					</div>
				)}
			</div>

			{result.playerResults.length === 0 ? (
				<p className="text-sm text-gray-400">No players recorded for this game.</p>
			) : (
				<div className="w-full overflow-x-auto">
					<table className="w-full text-left text-sm text-gray-300">
						<thead className="border-b border-gray-700 text-xs text-gray-500 uppercase">
							<tr>
								<th className="py-2 pr-4">Player</th>
								<th className="w-20 px-2 py-2 text-center">Rank</th>
								<th className="w-20 px-2 py-2 text-center">Winner</th>
								<th className="w-20 px-2 py-2 text-center">Loser</th>
							</tr>
						</thead>
						<tbody>
							{[...result.playerResults]
								.sort((a, b) => {
									// 1. Winners first
									if (a.isWinner && !b.isWinner) return -1;
									if (!a.isWinner && b.isWinner) return 1;

									// 2. Losers last
									if (a.isLoser && !b.isLoser) return 1;
									if (!a.isLoser && b.isLoser) return -1;

									// 3. Rank sort (only if both have rank)
									if (typeof a.rank === "number" && typeof b.rank === "number") {
										return a.rank - b.rank;
									}

									// 4. Alphabetical fallback
									const nameA = getPlayerName(a.playerId).toLowerCase();
									const nameB = getPlayerName(b.playerId).toLowerCase();
									return nameA.localeCompare(nameB);
								})
								.map((result) => {
									const player = players.find((p) => p.id === result.playerId);
									if (!player) return null;

									const name = player.preferredName || `${player.firstName} ${player.lastName}`;

									const showAward = result.isWinner || result.rank === 1;

									return (
										<tr key={result.playerId} className="border-b border-gray-700 last:border-none">
											<td className="flex items-center gap-2 py-2 pr-4">
												{name}
												{showAward && <Award className="h-4 w-4 text-yellow-400" />}
											</td>
											<td className="px-2 py-2 text-center">
												{typeof result.rank === "number" ? result.rank : "—"}
											</td>
											<td className="px-2 py-2 text-center">
												{result.isWinner && (
													<CheckCircle className="mx-auto h-5 w-5 text-green-500" />
												)}
											</td>
											<td className="px-2 py-2 text-center">
												{result.isLoser && <XCircle className="mx-auto h-5 w-5 text-red-500" />}
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};
