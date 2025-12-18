import { useState } from "react";
import type { IEvent } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";
import { CalendarDays, MapPin, Users, Gamepad2 } from "lucide-react";
import { getDisplayName, getFullName } from "features/players/utils/helpers";
import { Input, Label, Button, FormHeader, Chip } from "common/components";

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

	return (
		<form onSubmit={handleSubmit} className="m-0 flex flex-col gap-4 p-0">
			<FormHeader icon={<MapPin />} title={initialData ? "Edit Event" : "Add Event"} />

			<div>
				<Label>Location</Label>
				<Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
			</div>

			<div>
				<Label>Date</Label>
				<Input type="date" value={date} onChange={(e) => setDate(e.target.value)} icon={<CalendarDays />} />
			</div>

			<div>
				<Label>Players</Label>
				<div className="flex flex-wrap gap-2">
					{players.map((p) => (
						<Chip
							key={p.id}
							active={selectedPlayers.includes(p.id)}
							onClick={() => setSelectedPlayers((prev) => toggle(prev, p.id))}
							icon={<Users />}
							label={getDisplayName(p)}
							title={getFullName(p)}
						/>
					))}
				</div>
			</div>

			<div>
				<Label>Games</Label>
				<div className="flex flex-wrap gap-2">
					{games.map((g) => (
						<Chip
							key={g.id}
							active={selectedGames.includes(g.id)}
							onClick={() => setSelectedGames((prev) => toggle(prev, g.id))}
							icon={<Gamepad2 />}
							label={g.name}
							title={g.name}
						/>
					))}
				</div>
			</div>

			<Button type="submit">{initialData ? "Save Changes" : "Add Event"}</Button>
		</form>
	);
};
