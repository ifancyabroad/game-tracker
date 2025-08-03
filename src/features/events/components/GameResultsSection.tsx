import { useState } from "react";
import type { IGame } from "features/games/types";
import type { IPlayer } from "features/players/types";
import type { IGameResult } from "features/events/types";

interface IGameResultsSectionProps {
	selectedGames: string[];
	selectedPlayers: string[];
	players: IPlayer[];
	games: IGame[];
	initialResults?: IGameResult[];
	onChange: (results: IGameResult[]) => void;
}

export const GameResultsSection: React.FC<IGameResultsSectionProps> = ({
	selectedGames,
	selectedPlayers,
	players,
	games,
	initialResults = [],
	onChange,
}) => {
	const [gameResults, setGameResults] = useState<IGameResult[]>(initialResults);

	const updateResults = (updated: IGameResult[]) => {
		setGameResults(updated);
		onChange(updated);
	};

	const togglePlayerParticipation = (gameId: string, playerId: string, isParticipating: boolean) => {
		const updated = [...gameResults];
		let gameEntry = updated.find((gr) => gr.gameId === gameId);

		if (!gameEntry) {
			gameEntry = { gameId, results: [] };
			updated.push(gameEntry);
		}

		if (isParticipating) {
			if (!gameEntry.results.some((r) => r.playerId === playerId)) {
				gameEntry.results.push({ playerId });
			}
		} else {
			gameEntry.results = gameEntry.results.filter((r) => r.playerId !== playerId);
		}

		updateResults(updated);
	};

	const updatePlayerField = <K extends keyof IGameResult["results"][number]>(
		gameId: string,
		playerId: string,
		field: K,
		value: IGameResult["results"][number][K],
	) => {
		const updated = [...gameResults];
		const gameEntry = updated.find((gr) => gr.gameId === gameId);
		if (!gameEntry) return;

		const playerResult = gameEntry.results.find((r) => r.playerId === playerId);
		if (!playerResult) return;

		playerResult[field] = value;

		// Mutually exclusive fields
		if (field === "isWinner" && value === true) {
			playerResult.isLoser = false;
		}
		if (field === "isLoser" && value === true) {
			playerResult.isWinner = false;
		}

		updateResults(updated);
	};

	return (
		<div>
			<hr className="my-4 border-gray-700" />
			<h4 className="text-md font-semibold text-white">Game Results</h4>

			{selectedGames.map((gameId) => {
				const game = games.find((g) => g.id === gameId);
				if (!game) return null;

				const gameEntry = gameResults.find((gr) => gr.gameId === gameId) || { gameId, results: [] };
				const participantIds = new Set(gameEntry.results.map((r) => r.playerId));

				return (
					<div key={gameId} className="my-3 rounded border border-gray-700 bg-gray-800 p-4">
						<h5 className="mb-3 text-sm font-bold text-[var(--color-primary)]">{game.name}</h5>

						{selectedPlayers.map((playerId) => {
							const player = players.find((p) => p.id === playerId);
							const name = player?.preferredName || `${player?.firstName} ${player?.lastName}`;
							const isParticipating = participantIds.has(playerId);
							const playerResult = gameEntry.results.find((r) => r.playerId === playerId);

							return (
								<div
									key={playerId}
									className="grid grid-cols-[1fr_60px_60px_60px] items-center gap-3 rounded px-2 py-1 text-sm text-white hover:bg-gray-700"
								>
									<label className="flex items-center gap-2 text-xs text-gray-300">
										<input
											type="checkbox"
											checked={isParticipating}
											onChange={(e) =>
												togglePlayerParticipation(gameId, playerId, e.target.checked)
											}
											className="h-4 w-4 accent-[var(--color-primary)]"
										/>
										{name}
									</label>

									<input
										type="number"
										min={1}
										disabled={!isParticipating}
										placeholder="Rank"
										className="w-full rounded border border-gray-600 bg-gray-900 p-1 text-white focus:border-[var(--color-primary)] focus:outline-none disabled:opacity-30"
										value={playerResult?.rank ?? ""}
										onChange={(e) =>
											updatePlayerField(
												gameId,
												playerId,
												"rank",
												Number(e.target.value) || undefined,
											)
										}
									/>

									<label className="flex items-center justify-end gap-1 text-xs text-gray-300">
										<input
											type="checkbox"
											disabled={!isParticipating}
											checked={playerResult?.isWinner ?? false}
											onChange={(e) =>
												updatePlayerField(gameId, playerId, "isWinner", e.target.checked)
											}
											className="h-4 w-4 accent-green-500 disabled:opacity-30"
										/>
										<span className="select-none">Winner</span>
									</label>

									<label className="flex items-center justify-end gap-1 text-xs text-gray-300">
										<input
											type="checkbox"
											disabled={!isParticipating}
											checked={playerResult?.isLoser ?? false}
											onChange={(e) =>
												updatePlayerField(gameId, playerId, "isLoser", e.target.checked)
											}
											className="h-4 w-4 accent-red-500 disabled:opacity-30"
										/>
										<span className="select-none">Loser</span>
									</label>
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};
