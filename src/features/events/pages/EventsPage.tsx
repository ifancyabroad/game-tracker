import { useModal } from "common/context/ModalContext";
import { useEvents } from "features/events/context/EventsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { EventForm } from "features/events/components/EventForm";
import { ConfirmDelete } from "common/components/ConfirmDelete";
import type { IEvent } from "features/events/types";
import { EventCard } from "features/events/components/EventCard";
import { NavLink } from "react-router";

export const EventsPage: React.FC = () => {
	const { events, addEvent, editEvent, deleteEvent } = useEvents();
	const { players } = usePlayers();
	const { games } = useGames();
	const { openModal, closeModal } = useModal();

	const handleAdd = () => {
		openModal(
			<EventForm
				onSubmit={async (data) => {
					await addEvent(data);
					closeModal();
				}}
				players={players}
				games={games}
			/>,
		);
	};

	const handleEdit = (event: IEvent) => {
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

	const handleDelete = (event: IEvent) => {
		openModal(
			<ConfirmDelete
				title="Delete Event"
				message={`Are you sure you want to delete this event at "${event.location}"?`}
				onConfirm={() => {
					deleteEvent(event.id);
					closeModal();
				}}
				onCancel={closeModal}
			/>,
		);
	};

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Events</h2>
				<button
					onClick={handleAdd}
					className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-[var(--color-primary-contrast)] transition-opacity hover:opacity-90"
				>
					+ Add Event
				</button>
			</div>

			{events.length === 0 ? (
				<p className="text-gray-400">No events added yet.</p>
			) : (
				<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{events.map((event) => (
						<li key={event.id}>
							<NavLink to={`/events/${event.id}`}>
								<EventCard
									event={event}
									onEdit={() => handleEdit(event)}
									onDelete={() => handleDelete(event)}
									playerLookup={players}
									gameLookup={games}
								/>
							</NavLink>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
