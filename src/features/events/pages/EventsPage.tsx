import { useModal } from "common/context/ModalContext";
import { useEvents } from "features/events/context/EventsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { EventForm } from "features/events/components/EventForm";
import { ConfirmDelete } from "common/components/ConfirmDelete";
import type { IEvent } from "features/events/types";
import { EventCard } from "features/events/components/EventCard";
import { NavLink } from "react-router";
import { useAuth } from "common/context/AuthContext";
import { CalendarPlus, CalendarDays } from "lucide-react";

export const EventsPage: React.FC = () => {
	const { events, addEvent, editEvent, deleteEvent } = useEvents();
	const { players } = usePlayers();
	const { games } = useGames();
	const user = useAuth();
	const { openModal, closeModal } = useModal();

	const handleAdd = () => {
		openModal(
			<EventForm
				onSubmit={async (event: Omit<IEvent, "id">) => {
					await addEvent(event);
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
				onSubmit={async (changes: Omit<IEvent, "id">) => {
					await editEvent(event.id, changes);
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
				title="Delete event?"
				message={`This will remove the event at ${event.location}.`}
				onConfirm={async () => {
					await deleteEvent(event.id);
					closeModal();
				}}
				onCancel={closeModal}
			/>,
		);
	};

	return (
		<div className="mx-auto max-w-6xl px-4 py-6">
			<div className="mb-4 flex items-center justify-between gap-4">
				<div className="flex items-center gap-2 text-white">
					<CalendarDays className="h-5 w-5" />
					<h1 className="text-base font-semibold">Events</h1>
					<span className="rounded-full border border-gray-700 px-2 py-0.5 text-xs text-gray-300">
						{events.length}
					</span>
				</div>
				{user && (
					<button
						onClick={handleAdd}
						className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-white/5"
					>
						<CalendarPlus className="h-4 w-4" /> Add Event
					</button>
				)}
			</div>

			{events.length === 0 ? (
				<div className="rounded-xl border border-gray-700 bg-[var(--color-surface)] p-8 text-center text-sm text-gray-400">
					No events yet.{" "}
					{user ? "Create your first event to start tracking results." : "Sign in to add events."}
				</div>
			) : (
				<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{events.map((event) => (
						<li key={event.id} className="transition-transform hover:-translate-y-0.5">
							<NavLink to={`/events/${event.id}`} className="block">
								<EventCard
									event={event}
									canEdit={!!user}
									onEdit={() => handleEdit(event)}
									onDelete={() => handleDelete(event)}
									players={players}
									games={games}
								/>
							</NavLink>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
