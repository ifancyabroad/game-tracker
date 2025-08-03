import { useParams, useNavigate } from "react-router";
import { useEvents } from "features/events/context/EventsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { ArrowLeft, CalendarDays, MapPin, Users, Gamepad2 } from "lucide-react";
import { useModal } from "common/context/ModalContext";
import { EventForm } from "features/events/components/EventForm";
import { GameResultsDisplay } from "features/events/components/GameResultsDisplay";

export const EventDetailPage: React.FC = () => {
	const { eventId } = useParams();
	const navigate = useNavigate();
	const { events, editEvent } = useEvents();
	const { players } = usePlayers();
	const { games } = useGames();
	const { openModal, closeModal } = useModal();

	const event = events.find((e) => e.id === eventId);

	if (!event) {
		return <div className="text-red-500">Event not found.</div>;
	}

	const gameResults = event.gameResults ?? [];

	const getPlayerName = (id: string) => {
		const p = players.find((p) => p.id === id);
		return p?.preferredName || `${p?.firstName} ${p?.lastName}` || "Unknown";
	};

	const getGameName = (id: string) => games.find((g) => g.id === id)?.name || "Unknown";

	const handleEdit = () => {
		openModal(
			<EventForm
				initialData={event}
				onSubmit={async (data) => {
					await editEvent(event.id, data);
					closeModal();
				}}
				players={players}
				games={games}
			/>,
		);
	};

	return (
		<div>
			<button
				onClick={() => navigate(-1)}
				className="mb-6 flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
			>
				<ArrowLeft size={16} />
				Back to Events
			</button>

			<div className="rounded-xl border border-gray-800 bg-[var(--color-surface)] p-6 shadow-lg">
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-2xl font-bold text-white">Event Details</h2>
					<button
						onClick={handleEdit}
						className="rounded bg-[var(--color-primary)] px-4 py-1.5 text-sm font-semibold text-[var(--color-primary-contrast)] transition hover:opacity-90"
					>
						Edit Event
					</button>
				</div>

				<div className="mb-4 flex flex-col gap-2 text-sm text-gray-300">
					<div className="flex items-center gap-2">
						<CalendarDays size={16} />
						<span>{new Date(event.date).toLocaleDateString()}</span>
					</div>
					<div className="flex items-center gap-2">
						<MapPin size={16} />
						<span>{event.location}</span>
					</div>
				</div>

				<hr className="my-4 border-gray-700" />

				<div className="mb-4">
					<h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-100">
						<Users size={18} />
						Players
					</h3>
					<ul className="list-inside list-disc text-sm text-gray-300">
						{event.playerIds.map((id) => (
							<li key={id}>{getPlayerName(id)}</li>
						))}
					</ul>
				</div>

				<div>
					<h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-100">
						<Gamepad2 size={18} />
						Games
					</h3>
					<ul className="list-inside list-disc text-sm text-gray-300">
						{event.gameIds.map((id) => (
							<li key={id}>{getGameName(id)}</li>
						))}
					</ul>
				</div>

				{gameResults.length > 0 && (
					<>
						<hr className="my-6 border-gray-700" />
						<h3 className="mb-2 text-lg font-semibold text-white">Game Results</h3>
						<GameResultsDisplay results={gameResults} games={games} players={players} />
					</>
				)}
			</div>
		</div>
	);
};
