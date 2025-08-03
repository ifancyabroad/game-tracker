import { CalendarDays, Edit, Trash2 } from "lucide-react";
import type { IEvent } from "features/events/types";

interface IEventCardProps {
	event: IEvent;
	onEdit?: (event: IEvent) => void;
	onDelete?: (id: string) => void;
	playerLookup: { id: string; preferredName?: string; firstName?: string; lastName?: string }[];
	gameLookup: { id: string; name: string }[];
}

export const EventCard: React.FC<IEventCardProps> = ({ event, onEdit, onDelete, playerLookup, gameLookup }) => {
	const resolveNames = (
		ids: string[],
		lookup: { id: string; name?: string; preferredName?: string; firstName?: string; lastName?: string }[],
	) => {
		return ids
			.map((id) => {
				const match = lookup.find((item) => item.id === id);
				if (!match) return "Unknown";
				return match.name || match.preferredName || `${match.firstName} ${match.lastName}`;
			})
			.join(", ");
	};

	return (
		<div className="flex flex-col gap-2 rounded-xl border border-gray-800 bg-[var(--color-surface)] p-4 shadow-lg">
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
					<CalendarDays size={22} className="text-gray-400" />
				</div>
				<div className="flex-1">
					<p className="text-md font-semibold">{event.location}</p>
					<p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
				</div>
			</div>

			<div className="text-sm text-gray-300">
				<strong>Games:</strong> {resolveNames(event.gameIds, gameLookup)}
			</div>
			<div className="text-sm text-gray-300">
				<strong>Players:</strong> {resolveNames(event.playerIds, playerLookup)}
			</div>

			<div className="mt-2 flex justify-end gap-2">
				<button
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onEdit?.(event);
					}}
					className="rounded p-2 transition-colors hover:bg-blue-500/20"
					title="Edit"
				>
					<Edit size={18} className="text-blue-400" />
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onDelete?.(event.id);
					}}
					className="rounded p-2 transition-colors hover:bg-red-500/20"
					title="Delete"
				>
					<Trash2 size={18} className="text-red-400" />
				</button>
			</div>
		</div>
	);
};
