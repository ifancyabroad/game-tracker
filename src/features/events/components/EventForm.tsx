import { useState } from "react";
import type { IEvent } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";

interface IEventFormProps {
	initialData?: IEvent;
	players: IPlayer[];
	games: IGame[];
	onSubmit: (event: Omit<IEvent, "id">) => void;
}

export const EventForm: React.FC<IEventFormProps> = ({ initialData, players, games, onSubmit }) => {
	const [location, setLocation] = useState(initialData?.location || "");
	const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0]);
	const [selectedPlayers, setSelectedPlayers] = useState<string[]>(initialData?.playerIds || []);
	const [selectedGames, setSelectedGames] = useState<string[]>(initialData?.gameIds || []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!location || !date || selectedPlayers.length === 0 || selectedGames.length === 0) return;

		onSubmit({
			location,
			date,
			playerIds: selectedPlayers,
			gameIds: selectedGames,
		});
	};

	const toggleSelection = (id: string, list: string[], setter: (v: string[]) => void) => {
		setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<h3 className="text-xl font-bold text-[var(--color-primary)]">
				{initialData ? "Edit Event" : "Add Event"}
			</h3>

			<input
				type="text"
				value={location}
				onChange={(e) => setLocation(e.target.value)}
				placeholder="Location"
				className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
				required
			/>

			<input
				type="date"
				value={date}
				onChange={(e) => setDate(e.target.value)}
				className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
				required
			/>

			<div>
				<label className="mb-1 block text-sm text-gray-400">Players</label>
				<div className="flex flex-wrap gap-2">
					{players.map((player) => {
						const name = player.preferredName || `${player.firstName} ${player.lastName}`;
						return (
							<button
								key={player.id}
								type="button"
								onClick={() => toggleSelection(player.id, selectedPlayers, setSelectedPlayers)}
								className={`rounded-full border px-3 py-1 text-sm transition ${
									selectedPlayers.includes(player.id)
										? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-contrast)]"
										: "border-gray-600 text-gray-300 hover:border-[var(--color-primary)]"
								}`}
							>
								{name}
							</button>
						);
					})}
				</div>
			</div>

			<div>
				<label className="mb-1 block text-sm text-gray-400">Games</label>
				<div className="flex flex-wrap gap-2">
					{games.map((game) => (
						<button
							key={game.id}
							type="button"
							onClick={() => toggleSelection(game.id, selectedGames, setSelectedGames)}
							className={`rounded-full border px-3 py-1 text-sm transition ${
								selectedGames.includes(game.id)
									? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-contrast)]"
									: "border-gray-600 text-gray-300 hover:border-[var(--color-primary)]"
							}`}
						>
							{game.name}
						</button>
					))}
				</div>
			</div>

			<button
				type="submit"
				className="w-full rounded-lg bg-[var(--color-primary)] py-2 font-semibold text-[var(--color-primary-contrast)] transition-opacity hover:opacity-90"
			>
				{initialData ? "Save Changes" : "Add Event"}
			</button>
		</form>
	);
};
