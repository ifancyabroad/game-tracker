import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { useResults } from "features/events/context/ResultsContext";
import type { IPlayer } from "features/players/types";
import type { IPlayerResult, IResult } from "features/events/types";
import type { IGame } from "features/games/types";
import { Gamepad2, Target } from "lucide-react";

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
	const [gameId, setGameId] = useState<string>(initialData?.gameId || (games[0]?.id ?? ""));
	const [playerResults, setPlayerResults] = useState<IPlayerResult[]>(
		initialData?.playerResults ||
			eventPlayerIds.map((id) => ({ playerId: id, rank: null, isWinner: false, isLoser: false })),
	);

	useEffect(() => {
		if (!initialData) {
			setPlayerResults((prev) => {
				const setIds = new Set(eventPlayerIds);
				const filtered = prev.filter((pr) => setIds.has(pr.playerId));
				const missing = eventPlayerIds
					.filter((id) => !filtered.some((pr) => pr.playerId === id))
					.map((id) => ({ playerId: id, rank: null, isWinner: false, isLoser: false }));
				return [...filtered, ...missing];
			});
		}
	}, [eventPlayerIds, initialData]);

	// Inputs: consistent across the app
	const inputCls =
		"w-full rounded-lg border border-gray-700 bg-black/20 px-3 py-2 text-sm text-[var(--color-text)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent";
	// Compact variant specifically for the small rank field
	const inputRankCls =
		"w-12 rounded-lg border border-gray-700 bg-black/20 px-2 py-1 text-sm text-[var(--color-text)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-center tabular-nums";

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const resultData: Omit<IResult, "id"> = {
			eventId,
			gameId,
			playerResults,
		};

		if (initialData) {
			await editResult(initialData.id, resultData);
		} else {
			await addResult(resultData);
		}

		onSuccess?.();
	};

	// Use a function declaration (TSX-safe) to avoid JSX parse issues with generics
	function update<K extends keyof IPlayerResult>(playerId: string, key: K, value: IPlayerResult[K]) {
		setPlayerResults((rows) => rows.map((r) => (r.playerId === playerId ? { ...r, [key]: value } : r)));
	}

	const getPlayer = (id: string) => players.find((p) => p.id === id);

	return (
		<form onSubmit={handleSubmit} className="m-0 flex flex-col gap-4 p-0">
			{/* Header */}
			<div className="flex items-center gap-2 text-gray-300">
				<Target className="h-4 w-4 text-[var(--color-primary)]" />
				<h3 className="text-sm font-semibold text-white">{initialData ? "Edit Result" : "Add Result"}</h3>
			</div>

			{/* Game selector — darker background for readability */}
			<div>
				<label className="mb-1 block text-xs text-gray-400">Game</label>
				<div className="relative">
					<select
						value={gameId}
						onChange={(e) => setGameId(e.target.value)}
						className={`${inputCls} appearance-none bg-gray-800 pr-8`}
					>
						{games.map((g) => (
							<option key={g.id} value={g.id}>
								{g.name}
							</option>
						))}
					</select>
					<Gamepad2 className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--color-primary)]" />
				</div>
			</div>

			{/* Players — relaxed layout so name + rank stay visible */}
			<div className="rounded-lg border border-gray-700 p-3">
				<p className="mb-2 text-xs font-medium text-gray-400">Players</p>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{playerResults.map((pr) => {
						const player = getPlayer(pr.playerId);
						const full = player ? `${player.firstName} ${player.lastName}` : "Unknown";
						const name = player?.preferredName ?? full;
						return (
							<div
								key={pr.playerId}
								className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md border border-gray-700 bg-black/20 p-3"
							>
								{/* Name block */}
								<div className="min-w-0 flex-1 basis-full sm:basis-auto">
									<p className="truncate text-sm text-white">{name}</p>
									{player?.preferredName && player.preferredName !== full && (
										<p className="truncate text-xs text-gray-400">{full}</p>
									)}
								</div>

								{/* Controls */}
								<div className="flex shrink-0 items-center gap-2">
									<input
										type="number"
										min={1}
										value={pr.rank ?? ""}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											update(pr.playerId, "rank", e.target.value ? Number(e.target.value) : null)
										}
										className={inputRankCls}
										placeholder="#"
									/>
									<label className="flex items-center gap-1 text-xs text-gray-300">
										<input
											type="checkbox"
											checked={!!pr.isWinner}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												update(pr.playerId, "isWinner", e.target.checked)
											}
											className="h-4 w-4 accent-green-500"
										/>
										Winner
									</label>
									<label className="flex items-center gap-1 text-xs text-gray-300">
										<input
											type="checkbox"
											checked={!!pr.isLoser}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												update(pr.playerId, "isLoser", e.target.checked)
											}
											className="h-4 w-4 accent-red-500"
										/>
										Loser
									</label>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<button
				type="submit"
				className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-contrast)] transition-opacity hover:opacity-90"
			>
				{initialData ? "Update Result" : "Submit Result"}
			</button>
		</form>
	);
};
