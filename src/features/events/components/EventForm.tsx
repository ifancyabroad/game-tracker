import { useState } from "react";
import type { IEvent } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";
import { CalendarDays, MapPin, Users, Gamepad2 } from "lucide-react";

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

	const toggle = (arr: string[], id: string) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!location.trim() || !date) return;
		onSubmit({ location: location.trim(), date, playerIds: selectedPlayers, gameIds: selectedGames });
	};

	const inputCls =
		"w-full rounded-lg border border-gray-700 bg-black/20 px-3 py-2 text-sm text-[var(--color-text)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent";
	const chipBase = "inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs transition-colors";

	return (
		<form onSubmit={handleSubmit} className="m-0 flex flex-col gap-4 p-0">
			<div className="flex items-center gap-2 text-gray-300">
				<MapPin className="h-4 w-4 text-[var(--color-primary)]" />
				<h3 className="text-sm font-semibold text-white">{initialData ? "Edit Event" : "Add Event"}</h3>
			</div>

			<div>
				<label className="mb-1 block text-xs text-gray-400">Location</label>
				<input
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					placeholder="Location"
					className={inputCls}
				/>
			</div>

			<div>
				<label className="mb-1 block text-xs text-gray-400">Date</label>
				<div className="relative">
					<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
					<CalendarDays className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--color-primary)]" />
				</div>
			</div>

			<div>
				<label className="mb-1 block text-xs text-gray-400">Players</label>
				<div className="flex flex-wrap gap-2">
					{players.map((p) => {
						const id = p.id;
						const active = selectedPlayers.includes(id);
						return (
							<button
								type="button"
								key={id}
								onClick={() => setSelectedPlayers((prev) => toggle(prev, id))}
								className={`${chipBase} ${active ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "border-gray-700 bg-black/20 text-gray-300 hover:border-[var(--color-primary)]/40 hover:bg-white/5"}`}
								title={p.preferredName ?? `${p.firstName} ${p.lastName}`}
							>
								<Users className="h-3.5 w-3.5" />
								<span className="max-w-[10rem] truncate">{p.preferredName ?? p.firstName}</span>
							</button>
						);
					})}
				</div>
			</div>

			<div>
				<label className="mb-1 block text-xs text-gray-400">Games</label>
				<div className="flex flex-wrap gap-2">
					{games.map((g) => {
						const id = g.id;
						const active = selectedGames.includes(id);
						return (
							<button
								type="button"
								key={id}
								onClick={() => setSelectedGames((prev) => toggle(prev, id))}
								className={`${chipBase} ${active ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "border-gray-700 bg-black/20 text-gray-300 hover:border-[var(--color-primary)]/40 hover:bg-white/5"}`}
								title={g.name}
							>
								<Gamepad2 className="h-3.5 w-3.5" />
								<span className="max-w-[10rem] truncate">{g.name}</span>
							</button>
						);
					})}
				</div>
			</div>

			<button
				type="submit"
				className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-contrast)] transition-opacity hover:opacity-90"
			>
				{initialData ? "Save Changes" : "Add Event"}
			</button>
		</form>
	);
};
