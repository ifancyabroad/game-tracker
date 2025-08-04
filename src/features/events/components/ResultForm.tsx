import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { useResults } from "features/events/context/ResultsContext";
import type { IPlayer } from "features/players/types";
import type { IPlayerResult, IResult } from "features/events/types";
import type { IGame } from "features/games/types";

interface ResultFormProps {
	eventId: string;
	players: IPlayer[];
	games: IGame[];
	onSuccess?: () => void;
	initialData?: IResult;
	eventPlayerIds: string[];
}

export const ResultForm: React.FC<ResultFormProps> = ({
	eventId,
	players,
	games,
	onSuccess,
	initialData,
	eventPlayerIds,
}) => {
	const { addResult, editResult } = useResults();
	const [gameId, setGameId] = useState<string>(initialData?.gameId || games[0]?.id || "");
	const [playerResults, setPlayerResults] = useState<IPlayerResult[]>([]);
	const eventPlayers = players.filter((p) => eventPlayerIds.includes(p.id));

	useEffect(() => {
		const eventPlayers = players.filter((p) => eventPlayerIds.includes(p.id));

		if (initialData) {
			setPlayerResults(initialData.playerResults);
		} else {
			setPlayerResults(
				eventPlayers.map((p) => ({
					playerId: p.id,
					rank: null,
					isWinner: false,
					isLoser: false,
				})),
			);
		}
	}, [initialData, eventPlayerIds, players]);

	const toggleParticipation = (playerId: string, isParticipating: boolean) => {
		setPlayerResults((prev) =>
			isParticipating
				? [...prev, { playerId, rank: null, isWinner: false, isLoser: false }]
				: prev.filter((pr) => pr.playerId !== playerId),
		);
	};

	const handleChange = <K extends keyof IPlayerResult>(playerId: string, field: K, value: IPlayerResult[K]) => {
		setPlayerResults((prev) =>
			prev.map((pr) => {
				if (pr.playerId !== playerId) return pr;
				const updated = { ...pr, [field]: value };

				// Enforce exclusivity
				if (field === "isWinner" && value === true) {
					updated.isLoser = false;
				}
				if (field === "isLoser" && value === true) {
					updated.isWinner = false;
				}

				return updated;
			}),
		);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const resultData = {
			eventId,
			gameId,
			playerResults,
		};

		if (initialData) {
			await editResult(initialData.id, resultData);
		} else {
			await addResult(resultData);
		}

		if (onSuccess) onSuccess();
	};

	const isParticipating = (playerId: string) => playerResults.some((pr) => pr.playerId === playerId);

	const getResult = (playerId: string): IPlayerResult | undefined =>
		playerResults.find((pr) => pr.playerId === playerId);

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<h3 className="text-xl font-bold text-[var(--color-primary)]">
				{initialData ? "Edit Game Result" : "Add Game Result"}
			</h3>

			<div>
				<label className="mb-1 block text-sm text-gray-400">Select Game</label>
				<select
					value={gameId}
					onChange={(e: ChangeEvent<HTMLSelectElement>) => setGameId(e.target.value)}
					className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-white focus:border-[var(--color-primary)] focus:outline-none"
				>
					{games.map((game) => (
						<option key={game.id} value={game.id}>
							{game.name}
						</option>
					))}
				</select>
			</div>

			<div>
				<h4 className="mb-2 text-sm text-gray-400">Player Results</h4>
				<div className="space-y-1">
					{eventPlayers.map((player) => {
						const name = player.preferredName || `${player.firstName} ${player.lastName}`;
						const active = isParticipating(player.id);
						const result = getResult(player.id);

						return (
							<div
								key={player.id}
								className="grid grid-cols-[1fr_60px_60px_60px] items-center gap-3 rounded px-2 py-1 text-sm text-white hover:bg-gray-700"
							>
								<label className="flex items-center gap-2 text-xs text-gray-300">
									<input
										type="checkbox"
										checked={active}
										onChange={(e) => toggleParticipation(player.id, e.target.checked)}
										className="h-4 w-4 accent-[var(--color-primary)]"
									/>
									{name}
								</label>

								<input
									type="number"
									min={1}
									placeholder="Rank"
									className="w-full rounded border border-gray-600 bg-gray-900 p-1 text-white focus:border-[var(--color-primary)] focus:outline-none disabled:opacity-30"
									value={result?.rank ?? ""}
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										handleChange(
											player.id,
											"rank",
											e.target.value === "" ? null : Number(e.target.value),
										)
									}
									disabled={!active}
								/>

								<label className="flex items-center justify-end gap-1 text-xs text-gray-300">
									<input
										type="checkbox"
										disabled={!active}
										checked={result?.isWinner ?? false}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											handleChange(player.id, "isWinner", e.target.checked)
										}
										className="h-4 w-4 accent-green-500 disabled:opacity-30"
									/>
									Winner
								</label>

								<label className="flex items-center justify-end gap-1 text-xs text-gray-300">
									<input
										type="checkbox"
										disabled={!active}
										checked={result?.isLoser ?? false}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											handleChange(player.id, "isLoser", e.target.checked)
										}
										className="h-4 w-4 accent-red-500 disabled:opacity-30"
									/>
									Loser
								</label>
							</div>
						);
					})}
				</div>
			</div>

			<button
				type="submit"
				className="w-full rounded bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-contrast)] transition hover:opacity-90 disabled:opacity-50"
			>
				{initialData ? "Update Result" : "Submit Result"}
			</button>
		</form>
	);
};
