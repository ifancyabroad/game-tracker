import { useParams, useNavigate, Link } from "react-router";
import { useEvents } from "features/events/context/EventsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { useResults } from "features/events/context/ResultsContext";
import { ArrowLeft, CalendarDays, MapPin, Users, Gamepad2, Plus, Edit, Trash2 } from "lucide-react";
import { useModal } from "common/context/ModalContext";
import { EventForm } from "features/events/components/EventForm";
import { ResultForm } from "features/events/components/ResultForm";
import { ResultDisplay } from "features/events/components/ResultDisplay";
import type { IEvent, IResult } from "features/events/types";
import { ConfirmDelete } from "common/components/ConfirmDelete";
import { useAuth } from "common/context/AuthContext";
import { getDisplayName } from "features/players/utils/helpers";

export const EventDetailPage: React.FC = () => {
	const { eventId } = useParams();
	const navigate = useNavigate();

	const { events, editEvent, deleteEvent } = useEvents();
	const { players } = usePlayers();
	const { games, gameById } = useGames();
	const { results, deleteResult } = useResults();
	const { openModal, closeModal } = useModal();
	const user = useAuth();

	const event = events.find((e) => e.id === eventId);
	const eventResults = results.filter((r) => r.eventId === eventId).sort((a, b) => a.order - b.order);

	const getPlayerName = (id: string) => {
		const p = players.find((pl) => pl.id === id);
		return getDisplayName(p);
	};
	const getGameName = (id: string) => gameById.get(id)?.name ?? "Unknown";

	const handleBack = () => navigate(-1);

	const handleEditEvent = (ev: IEvent) => {
		openModal(
			<EventForm
				initialData={ev}
				players={players}
				games={games}
				onSubmit={async (data) => {
					await editEvent(ev.id, data);
					closeModal();
				}}
			/>,
		);
	};

	const handleDeleteEvent = (ev: IEvent) => {
		openModal(
			<ConfirmDelete
				title="Delete event?"
				message={`This will remove the event at ${ev.location}.`}
				onConfirm={async () => {
					await deleteEvent(ev.id);
					closeModal();
					navigate("/events");
				}}
				onCancel={closeModal}
			/>,
		);
	};

	const handleAddResult = () => {
		if (!event) return;
		openModal(
			<ResultForm
				eventId={event.id}
				players={players}
				games={games}
				eventPlayerIds={event.playerIds}
				allowedGameIds={event.gameIds}
				numOfResults={eventResults.length}
				onSuccess={closeModal}
			/>,
		);
	};

	const handleEditResult = (result: IResult) => {
		if (!event) return;
		openModal(
			<ResultForm
				initialData={result}
				eventId={event.id}
				players={players}
				games={games}
				eventPlayerIds={event.playerIds}
				allowedGameIds={event.gameIds}
				numOfResults={eventResults.length}
				onSuccess={closeModal}
			/>,
		);
	};

	const handleDeleteResult = (resultId: string) => {
		openModal(
			<ConfirmDelete
				title="Delete result?"
				message="This will remove the selected result."
				onConfirm={async () => {
					await deleteResult(resultId);
					closeModal();
				}}
				onCancel={closeModal}
			/>,
		);
	};

	if (!event) {
		return (
			<div className="mx-auto max-w-6xl">
				<button
					onClick={handleBack}
					className="mb-4 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"
				>
					<ArrowLeft size={18} /> Back
				</button>
				<div className="rounded-xl border border-gray-700 bg-[var(--color-surface)] p-6 text-sm text-gray-400">
					Event not found.
				</div>
			</div>
		);
	}

	const date = new Date(event.date);
	const dateLabel = isNaN(date.getTime())
		? event.date
		: date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

	return (
		<div className="mx-auto max-w-6xl">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<button
						onClick={handleBack}
						className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-[var(--color-surface)] px-3 py-2 text-sm text-gray-200 hover:bg-[var(--color-primary)]/10"
					>
						<ArrowLeft size={16} /> Back
					</button>
					<h1 className="text-base font-semibold text-white">Event Details</h1>
				</div>

				{user && (
					<div className="flex items-center gap-2">
						<button
							onClick={() => handleEditEvent(event)}
							className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-[var(--color-surface)] px-3 py-2 text-sm text-gray-200 hover:bg-[var(--color-primary)]/10"
						>
							<Edit size={16} /> Edit
						</button>
						<button
							onClick={() => handleDeleteEvent(event)}
							className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-[var(--color-surface)] px-3 py-2 text-sm text-red-300 hover:bg-red-500/20"
						>
							<Trash2 size={16} /> Delete
						</button>
						<button
							onClick={handleAddResult}
							className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-[var(--color-surface)] px-3 py-2 text-sm text-white hover:bg-[var(--color-primary)]/10"
						>
							<Plus size={16} /> Add Result
						</button>
					</div>
				)}
			</div>

			<div className="mb-6 rounded-xl border border-gray-700 bg-[var(--color-surface)] p-4">
				<div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-200">
					<div className="inline-flex items-center gap-2">
						<CalendarDays size={16} />
						<span>{dateLabel}</span>
					</div>
					<div className="inline-flex items-center gap-2">
						<MapPin size={16} />
						<span>{event.location}</span>
					</div>
					<span className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-black/20 px-2 py-1 text-xs text-gray-300">
						<Users size={14} className="text-[var(--color-primary)]" /> {event.playerIds.length}{" "}
						{event.playerIds.length === 1 ? "player" : "players"}
					</span>
					<span className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-black/20 px-2 py-1 text-xs text-gray-300">
						<Gamepad2 size={14} className="text-[var(--color-primary)]" /> {event.gameIds.length}{" "}
						{event.gameIds.length === 1 ? "game" : "games"}
					</span>
				</div>

				<div className="mt-4 grid gap-4">
					<div>
						<h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
							<Users size={16} /> Players
						</h3>
						<div className="flex flex-wrap gap-2">
							{event.playerIds.map((id) => (
								<Link
									key={id}
									to={`/players/${id}`}
									className="inline-flex items-center rounded-full border border-gray-700 bg-black/20 px-2 py-1 text-xs text-gray-300 transition-transform hover:-translate-y-0.5"
								>
									{getPlayerName(id)}
								</Link>
							))}
						</div>
					</div>
					<div>
						<h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
							<Gamepad2 size={16} /> Games
						</h3>
						<div className="flex flex-wrap gap-2">
							{event.gameIds.map((id) => (
								<span
									key={id}
									className="inline-flex items-center rounded-full border border-gray-700 bg-black/20 px-2 py-1 text-xs text-gray-300"
								>
									{getGameName(id)}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			<div>
				<div className="mb-3 flex items-center justify-between">
					<h2 className="text-base font-semibold text-white">Results</h2>
					{user && (
						<button
							onClick={handleAddResult}
							className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-[var(--color-surface)] px-3 py-2 text-sm text-white hover:bg-[var(--color-primary)]/10"
						>
							<Plus size={16} /> Add Result
						</button>
					)}
				</div>

				{eventResults.length === 0 ? (
					<div className="rounded-xl border border-gray-700 bg-[var(--color-surface)] p-6 text-sm text-gray-400">
						No results added yet.
					</div>
				) : (
					<div className="grid gap-4">
						{eventResults.map((result) => (
							<ResultDisplay
								key={result.id}
								result={result}
								games={games}
								players={players}
								canEdit={!!user}
								onEdit={handleEditResult}
								onDelete={handleDeleteResult}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default EventDetailPage;
