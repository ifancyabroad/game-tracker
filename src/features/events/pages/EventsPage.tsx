import { useModal } from "common/context/ModalContext";
import { useEvents } from "features/events/context/EventsContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useGames } from "features/games/context/GamesContext";
import { useSortedEvents } from "features/events/utils/hooks";
import { EventForm } from "features/events/components/EventForm";
import { Button, PageHeader, EmptyState, ConfirmDelete } from "common/components";
import type { IEvent } from "features/events/types";
import { EventCard } from "features/events/components/EventCard";
import { NavLink } from "react-router";
import { useAuth } from "common/context/AuthContext";
import { CalendarPlus, CalendarDays } from "lucide-react";
import { useToast } from "common/utils/hooks";

export const EventsPage: React.FC = () => {
	const { addEvent, editEvent, deleteEvent } = useEvents();
	const events = useSortedEvents();
	const { players } = usePlayers();
	const { games, gameById } = useGames();
	const { isAdmin } = useAuth();
	const { openModal, closeModal } = useModal();
	const toast = useToast();

	const handleAddEvent = async (event: Omit<IEvent, "id">) => {
		try {
			await addEvent(event);
			toast.success("Event added successfully");
			closeModal();
		} catch (error) {
			toast.error("Failed to add event");
			throw error;
		}
	};

	const handleEditEvent = async (event: IEvent, changes: Omit<IEvent, "id">) => {
		try {
			await editEvent(event.id, changes);
			toast.success("Event updated successfully");
			closeModal();
		} catch (error) {
			toast.error("Failed to update event");
			throw error;
		}
	};

	const handleDeleteEvent = async (event: IEvent) => {
		try {
			await deleteEvent(event.id);
			toast.success("Event deleted successfully");
			closeModal();
		} catch {
			toast.error("Failed to delete event");
		}
	};

	const handleAdd = () => {
		openModal(<EventForm onSubmit={handleAddEvent} players={players} games={games} />);
	};

	const handleEdit = (event: IEvent) => {
		openModal(
			<EventForm
				initialData={event}
				onSubmit={(changes) => handleEditEvent(event, changes)}
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
				onConfirm={() => handleDeleteEvent(event)}
				onCancel={closeModal}
			/>,
		);
	};

	return (
		<div className="mx-auto max-w-6xl">
			<PageHeader
				icon={<CalendarDays />}
				title="Events"
				count={events.length}
				action={
					isAdmin ? (
						<Button onClick={handleAdd} variant="primary" size="md">
							<CalendarPlus className="h-4 w-4" /> Add Event
						</Button>
					) : undefined
				}
			/>

			{events.length === 0 ? (
				<EmptyState>
					No events yet.{" "}
					{isAdmin ? "Create your first event to start tracking results." : "Check back later."}
				</EmptyState>
			) : (
				<ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
					{events.map((event) => (
						<li key={event.id} className="transition-transform hover:-translate-y-0.5">
							<NavLink to={`/events/${event.id}`} className="block">
								<EventCard
									event={event}
									canEdit={isAdmin}
									onEdit={() => handleEdit(event)}
									onDelete={() => handleDelete(event)}
									players={players}
									gameById={gameById}
								/>
							</NavLink>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
