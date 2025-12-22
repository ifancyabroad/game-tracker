import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IEvent } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";
import { CalendarDays, MapPin, Users, Gamepad2 } from "lucide-react";
import { getDisplayName, getFullName } from "features/players/utils/helpers";
import { Input, Label, Button, FormHeader, Chip, ErrorMessage } from "common/components";
import { eventSchema, type EventFormData } from "common/utils/validation";

interface IEventFormProps {
	initialData?: IEvent;
	players: IPlayer[];
	games: IGame[];
	onSubmit: (event: Omit<IEvent, "id">) => void;
}

export const EventForm: React.FC<IEventFormProps> = ({ initialData, players, games, onSubmit }) => {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<EventFormData>({
		resolver: zodResolver(eventSchema),
		defaultValues: {
			location: initialData?.location || "",
			date: initialData?.date || new Date().toISOString().split("T")[0],
			playerIds: initialData?.playerIds || [],
			gameIds: initialData?.gameIds || [],
			notes: initialData?.notes || "",
		},
	});

	const selectedPlayers = watch("playerIds");
	const selectedGames = watch("gameIds");

	const togglePlayer = (playerId: string) => {
		const newPlayers = selectedPlayers.includes(playerId)
			? selectedPlayers.filter((id) => id !== playerId)
			: [...selectedPlayers, playerId];
		setValue("playerIds", newPlayers, { shouldValidate: true });
	};

	const toggleGame = (gameId: string) => {
		const newGames = selectedGames.includes(gameId)
			? selectedGames.filter((id) => id !== gameId)
			: [...selectedGames, gameId];
		setValue("gameIds", newGames, { shouldValidate: true });
	};

	const onFormSubmit = (data: EventFormData) => {
		onSubmit(data);
	};

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className="m-0 flex flex-col gap-4 p-0">
			<FormHeader icon={<MapPin />} title={initialData ? "Edit Event" : "Add Event"} />

			<div>
				<Label required>Location</Label>
				<Input {...register("location")} placeholder="Location" />
				{errors.location && <ErrorMessage>{errors.location.message}</ErrorMessage>}
			</div>

			<div>
				<Label required>Date</Label>
				<Input type="date" {...register("date")} icon={<CalendarDays />} />
				{errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
			</div>

			<div>
				<Label>Event Summary (optional)</Label>
				<textarea
					{...register("notes")}
					placeholder="Write a summary of this event - highlights, memorable moments, funny stories..."
					rows={4}
					maxLength={1000}
					className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none"
				/>
				{errors.notes && <ErrorMessage>{errors.notes.message}</ErrorMessage>}
			</div>

			<div>
				<Label required>Players</Label>
				<div className="flex flex-wrap gap-2">
					{players.map((p) => (
						<Chip
							key={p.id}
							active={selectedPlayers.includes(p.id)}
							onClick={() => togglePlayer(p.id)}
							icon={<Users />}
							label={getDisplayName(p)}
							title={getFullName(p)}
						/>
					))}
				</div>
				{errors.playerIds && <ErrorMessage>{errors.playerIds.message}</ErrorMessage>}
			</div>

			<div>
				<Label required>Games</Label>
				<div className="flex flex-wrap gap-2">
					{games.map((g) => (
						<Chip
							key={g.id}
							active={selectedGames.includes(g.id)}
							onClick={() => toggleGame(g.id)}
							icon={<Gamepad2 />}
							label={g.name}
							title={g.name}
						/>
					))}
				</div>
				{errors.gameIds && <ErrorMessage>{errors.gameIds.message}</ErrorMessage>}
			</div>

			<Button type="submit">{initialData ? "Save Changes" : "Add Event"}</Button>
		</form>
	);
};
