import { useParams, useNavigate, Link } from "react-router";
import { useEvents } from "features/events/context/EventsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { useResults } from "features/events/context/ResultsContext";
import { ArrowLeft, CalendarDays, MapPin, Users, Gamepad2, Plus, Edit, Trash2 } from "lucide-react";
import { useModal } from "common/context/ModalContext";
import { Button, Card, ConfirmDelete } from "common/components";
import { EventForm } from "features/events/components/EventForm";
import { ResultForm } from "features/events/components/ResultForm";
import { ResultDisplay } from "features/events/components/ResultDisplay";
import type { IEvent, IResult } from "features/events/types";
import { useAuth } from "common/context/AuthContext";
import { getDisplayName } from "features/players/utils/helpers";

export const EventDetailPage: React.FC = () => {
	const { eventId } = useParams();
	const navigate = useNavigate();

	const { events, editEvent, deleteEvent } = useEvents();
	const { players, playerById } = usePlayers();
	const { games, gameById } = useGames();
	const { results, deleteResult } = useResults();
	const { openModal, closeModal } = useModal();
	const user = useAuth();

	const event = events.find((e) => e.id === eventId);
	const eventResults = results.filter((r) => r.eventId === eventId).sort((a, b) => a.order - b.order);

	const getPlayerName = (id: string) => {
		const p = playerById.get(id);
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
				games={games}
				playerById={playerById}
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
				games={games}
				playerById={playerById}
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
				<Button onClick={handleBack} variant="ghost" size="sm" className="mb-4">
					<ArrowLeft size={18} /> Back
				</Button>
				<Card className="p-6 text-sm text-gray-400">Event not found.</Card>
			</div>
		);
	}

	const date = new Date(event.date);
	const dateLabel = isNaN(date.getTime())
		? event.date
		: date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

	return (
		<div className="mx-auto max-w-6xl">
			<div className="mb-3 flex flex-wrap items-center justify-between gap-3 sm:mb-4">
				<div className="flex items-center gap-3">
					<Button onClick={handleBack} variant="secondary" size="md">
						<ArrowLeft size={16} /> Back
					</Button>
					<h1 className="text-base font-semibold text-white">Event Details</h1>
				</div>

				{user && (
					<div className="flex items-center gap-2">
						<Button onClick={() => handleEditEvent(event)} variant="secondary" size="md">
							<Edit size={16} /> Edit
						</Button>
						<Button
							onClick={() => handleDeleteEvent(event)}
							variant="secondary"
							size="md"
							className="text-red-300 hover:bg-red-500/20"
						>
							<Trash2 size={16} /> Delete
						</Button>
						<Button onClick={handleAddResult} variant="secondary" size="md">
							<Plus size={16} /> Add Result
						</Button>
					</div>
				)}
			</div>

			<Card className="mb-4 p-3 sm:mb-6 sm:p-4">
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
			</Card>

			<div>
				<div className="mb-2.5 flex items-center justify-between sm:mb-3">
					<h2 className="text-base font-semibold text-white">Results</h2>
					{user && (
						<Button onClick={handleAddResult} variant="secondary" size="md">
							<Plus size={16} /> Add Result
						</Button>
					)}
				</div>

				{eventResults.length === 0 ? (
					<Card className="p-6 text-sm text-gray-400">No results added yet.</Card>
				) : (
					<div className="grid gap-3 sm:gap-4">
						{eventResults.map((result) => (
							<ResultDisplay
								key={result.id}
								result={result}
								gameById={gameById}
								playerById={playerById}
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
