import { CalendarDays, Edit, Trash2 } from "lucide-react";
import type { IEvent } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";

interface IEventCardProps {
	event: IEvent;
	canEdit?: boolean;
	onEdit?: (event: IEvent) => void;
	onDelete?: (id: string) => void;
	players: IPlayer[];
	games: IGame[];
}

export const EventCard: React.FC<IEventCardProps> = ({ event, canEdit, onEdit, onDelete, players, games }) => {
	const formattedGames = event.gameIds
		.map((id) => {
			const game = games.find((g) => g.id === id);
			return game ? game.name : "Unknown Game";
		})
		.join(", ");

	const formattedPlayers = event.playerIds
		.map((id) => {
			const player = players.find((p) => p.id === id);
			return player ? player.preferredName || `${player.firstName} ${player.lastName}` : "Unknown Player";
		})
		.join(", ");

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
				<strong>Games:</strong> {formattedGames}
			</div>
			<div className="text-sm text-gray-300">
				<strong>Players:</strong> {formattedPlayers}
			</div>

			{canEdit && (
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
			)}
		</div>
	);
};
