import { useState, type ChangeEvent, type FormEvent, useEffect, useMemo } from "react";
import { useResults } from "features/events/context/ResultsContext";
import type { IPlayer } from "features/players/types";
import type { IPlayerResult, IResult } from "features/events/types";
import type { IGame } from "features/games/types";
import { Gamepad2, Target } from "lucide-react";
import { getDisplayName } from "features/players/utils/helpers";
import { Button, Select } from "common/components";

interface ResultFormProps {
	eventId: string;
	games: IGame[];
	playerById: Map<string, IPlayer>;
	onSuccess?: () => void;
	initialData?: IResult;
	eventPlayerIds: string[];
	allowedGameIds?: string[];
	numOfResults: number;
}

export const ResultForm: React.FC<ResultFormProps> = ({
	eventId,
	games,
	playerById,
	onSuccess,
	initialData,
	eventPlayerIds,
	allowedGameIds,
	numOfResults,
}) => {
	const { addResult, editResult } = useResults();
	const [gameId, setGameId] = useState<string>(initialData?.gameId ?? "");
	const [order, setOrder] = useState<number>(initialData?.order ?? numOfResults + 1);

	const filteredGames = useMemo(() => {
		if (!Array.isArray(allowedGameIds) || allowedGameIds.length === 0) return [] as IGame[];
		const set = new Set(allowedGameIds);
		return games.filter((g) => set.has(g.id));
	}, [games, allowedGameIds]);

	useEffect(() => {
		if (!filteredGames.length) {
			setGameId("");
			return;
		}
		if (!filteredGames.some((g) => g.id === gameId)) {
			setGameId(
				initialData?.gameId && filteredGames.some((g) => g.id === initialData.gameId)
					? initialData.gameId
					: filteredGames[0].id,
			);
		}
	}, [filteredGames, gameId, initialData?.gameId]);

	const [playerResults, setPlayerResults] = useState<IPlayerResult[]>(
		initialData?.playerResults ||
			eventPlayerIds.map((id) => ({ playerId: id, rank: null, isWinner: false, isLoser: false })),
	);

	// Participation map (playerId -> included)
	const [included, setIncluded] = useState<Record<string, boolean>>(() => {
		if (initialData) {
			const present = new Set(initialData.playerResults.map((r) => r.playerId));
			return Object.fromEntries(eventPlayerIds.map((id) => [id, present.has(id)]));
		}
		return Object.fromEntries(eventPlayerIds.map((id) => [id, true]));
	});

	// Keep playerResults in sync with event players
	useEffect(() => {
		setPlayerResults((prev) => {
			const setIds = new Set(eventPlayerIds);
			const filtered = prev.filter((pr) => setIds.has(pr.playerId));
			const missing = eventPlayerIds
				.filter((id) => !filtered.some((pr) => pr.playerId === id))
				.map((id) => ({ playerId: id, rank: null, isWinner: false, isLoser: false }));
			return [...filtered, ...missing];
		});
	}, [eventPlayerIds]);

	// Keep included map in sync with event players & initial data
	useEffect(() => {
		const present = initialData ? new Set(initialData.playerResults.map((r) => r.playerId)) : null;
		setIncluded((prev) => {
			const next: Record<string, boolean> = {};
			for (const id of eventPlayerIds) {
				next[id] = prev[id] ?? (present ? present.has(id) : true);
			}
			return next;
		});
	}, [eventPlayerIds, initialData]);

	// Inputs
	const inputCls =
		"rounded-lg border border-gray-700 bg-black/20 px-3 py-2 text-sm text-[var(--color-text)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent";
	const inputRankCls =
		"rounded-lg border border-gray-700 bg-black/20 px-2 py-1 text-sm text-[var(--color-text)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-center tabular-nums";

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const filtered = playerResults.filter((pr) => included[pr.playerId]);
		const resultData: Omit<IResult, "id"> = {
			eventId,
			gameId,
			order,
			playerResults: filtered,
		};

		if (initialData) {
			await editResult(initialData.id, resultData);
		} else {
			await addResult(resultData);
		}

		onSuccess?.();
	};

	function update<K extends keyof IPlayerResult>(playerId: string, key: K, value: IPlayerResult[K]) {
		setPlayerResults((rows) => rows.map((r) => (r.playerId === playerId ? { ...r, [key]: value } : r)));
	}

	const getPlayer = (id: string) => playerById.get(id);

	return (
		<form onSubmit={handleSubmit} className="m-0 flex flex-col gap-4 p-0">
			<div className="flex items-center gap-2 text-gray-300">
				<Target className="h-4 w-4 text-[var(--color-primary)]" />
				<h3 className="text-sm font-semibold text-white">{initialData ? "Edit Result" : "Add Result"}</h3>
			</div>

			<div>
				<div className="flex items-center justify-between gap-4">
					<div className="min-w-0 flex-1">
						<Select
							label="Game"
							icon={Gamepad2}
							value={gameId}
							onChange={(e) => setGameId(e.target.value)}
							disabled={!filteredGames.length}
						>
							{!filteredGames.length ? (
								<option value="">No games added to this event</option>
							) : (
								filteredGames.map((g) => (
									<option key={g.id} value={g.id}>
										{g.name}
									</option>
								))
							)}
						</Select>
					</div>

					<div>
						<label className="mb-1 block text-xs text-gray-400">Order</label>
						<div className="relative">
							<input
								type="number"
								value={order}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setOrder(e.target.value ? Number(e.target.value) : 1)
								}
								className={`${inputCls} w-16`}
								min={1}
								placeholder="#"
							/>
						</div>
					</div>
				</div>

				{!filteredGames.length && (
					<p className="mt-2 text-xs text-amber-300">
						This event doesn’t have any games yet. Add a game to the event to create a result.
					</p>
				)}
			</div>

			<div>
				<p className="mb-2 text-xs font-medium text-gray-400">Players</p>
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
					{playerResults.map((pr) => {
						const p = getPlayer(pr.playerId);
						const name = getDisplayName(p);
						const isIncluded = !!included[pr.playerId];
						return (
							<div
								key={pr.playerId}
								className={`rounded-md bg-black/20 p-3 ${isIncluded ? "" : "opacity-60"}`}
							>
								<div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
									<label className="flex items-center gap-2 text-sm whitespace-nowrap text-white">
										<input
											type="checkbox"
											checked={isIncluded}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												setIncluded((m) => ({ ...m, [pr.playerId]: e.target.checked }))
											}
											className="h-4 w-4 accent-[var(--color-primary)]"
										/>
										{name}
									</label>
								</div>

								<div className="mt-2 flex flex-wrap items-center gap-3">
									<div className="flex items-center gap-2">
										<span className="text-xs text-gray-400">Rank</span>
										<input
											type="number"
											min={1}
											value={pr.rank ?? ""}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												update(
													pr.playerId,
													"rank",
													e.target.value ? Number(e.target.value) : null,
												)
											}
											className={`${inputRankCls} w-12`}
											placeholder="#"
											disabled={!isIncluded}
										/>
									</div>

									<label className="flex items-center gap-1 text-xs whitespace-nowrap text-gray-300">
										<input
											type="checkbox"
											checked={!!pr.isWinner}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												update(pr.playerId, "isWinner", e.target.checked)
											}
											className="h-4 w-4 accent-green-500"
											disabled={!isIncluded}
										/>
										Win
									</label>
									<label className="flex items-center gap-1 text-xs whitespace-nowrap text-gray-300">
										<input
											type="checkbox"
											checked={!!pr.isLoser}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												update(pr.playerId, "isLoser", e.target.checked)
											}
											className="h-4 w-4 accent-red-500"
											disabled={!isIncluded}
										/>
										Lose
									</label>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<Button type="submit" disabled={!filteredGames.length || !gameId} variant="primary" size="md">
				{initialData ? "Update Result" : "Submit Result"}
			</Button>
		</form>
	);
};
