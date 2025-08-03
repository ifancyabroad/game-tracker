import { CheckCircle, XCircle, Award } from "lucide-react";
import type { IGame } from "features/games/types";
import type { IPlayer } from "features/players/types";
import type { IGameResult } from "features/events/types";

interface IGameResultsDisplayProps {
	results: IGameResult[];
	games: IGame[];
	players: IPlayer[];
}

export const GameResultsDisplay: React.FC<IGameResultsDisplayProps> = ({ results, games, players }) => {
	if (!results?.length) return null;

	const getPlayerName = (playerId: string): string => {
		const player = players.find((p) => p.id === playerId);
		if (!player) return "";
		return player.preferredName || `${player.firstName} ${player.lastName}`;
	};

	return (
		<div className="space-y-6">
			{results.map((gr) => {
				const game = games.find((g) => g.id === gr.gameId);
				if (!game) return null;

				return (
					<div key={gr.gameId} className="rounded border border-gray-700 bg-gray-800 p-4">
						<h4 className="text-md mb-3 font-semibold text-[var(--color-primary)]">{game.name}</h4>

						{gr.results.length === 0 ? (
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
										{[...gr.results]
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

												const name =
													player.preferredName || `${player.firstName} ${player.lastName}`;

												const showAward = result.isWinner || result.rank === 1;

												return (
													<tr
														key={result.playerId}
														className="border-b border-gray-700 last:border-none"
													>
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
															{result.isLoser && (
																<XCircle className="mx-auto h-5 w-5 text-red-500" />
															)}
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
			})}
		</div>
	);
};
