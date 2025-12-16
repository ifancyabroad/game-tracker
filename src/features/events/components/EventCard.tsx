import { CalendarDays, MapPin, Edit, Trash2, Gamepad2 } from "lucide-react";
import type { IEvent } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";
import { Avatar } from "common/components/Avatar";
import { getDisplayName } from "features/players/utils/helpers";

interface IEventCardProps {
	event: IEvent;
	canEdit?: boolean;
	onEdit?: (event: IEvent) => void;
	onDelete?: (id: string) => void;
	players: IPlayer[];
	gameById: Map<string, IGame>;
}

export const EventCard: React.FC<IEventCardProps> = ({ event, canEdit, onEdit, onDelete, players, gameById }) => {
	const date = new Date(event.date);
	const dateLabel = isNaN(date.getTime())
		? event.date
		: date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

	const eventPlayers = event.playerIds?.map((id) => players.find((p) => p.id === id)).filter(Boolean) as IPlayer[];

	const games = event.gameIds.map((id) => gameById.get(id)).filter(Boolean) as IGame[];

	const playerCount = eventPlayers.length;

	return (
		<div className="group relative cursor-pointer rounded-xl border border-gray-700 bg-[var(--color-surface)] p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-600 hover:shadow-md sm:p-4">
			{/* Header: Location & Date */}
			<div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
				<div className="min-w-0 flex-1">
					<div className="mb-0.5 flex items-center gap-1.5 sm:mb-1">
						<MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[var(--color-primary)] sm:h-4 sm:w-4" />
						<h3 className="truncate text-sm font-semibold text-white sm:text-base">{event.location}</h3>
					</div>
					<div className="flex items-center gap-1.5 text-xs text-gray-400 sm:text-sm">
						<CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
						<time>{dateLabel}</time>
					</div>
				</div>

				{/* Action Buttons */}
				{canEdit && (
					<div className="flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
						<button
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onEdit?.(event);
							}}
							title="Edit"
							className="rounded-lg border border-gray-700 bg-black/20 p-2 text-gray-200 hover:bg-white/10"
						>
							<Edit size={16} />
						</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onDelete?.(event.id);
							}}
							title="Delete"
							className="rounded-lg border border-gray-700 bg-black/20 p-2 text-red-300 hover:bg-red-500/20"
						>
							<Trash2 size={16} />
						</button>
					</div>
				)}
			</div>

			{/* Games Section */}
			{games.length > 0 ? (
				<div className="mb-2 flex flex-wrap items-center gap-1 sm:mb-3 sm:gap-1.5">
					{games.map((game) => (
						<span
							key={game.id}
							className="inline-flex items-center gap-1 rounded-md border border-gray-700 bg-black/30 px-1.5 py-0.5 text-xs font-medium text-gray-200 sm:px-2 sm:py-1"
						>
							<Gamepad2 className="h-3 w-3" />
							{game.name}
						</span>
					))}
				</div>
			) : (
				<div className="mb-2 text-xs text-gray-500 sm:mb-3">No games added</div>
			)}

			{/* Players Section */}
			{eventPlayers.length > 0 ? (
				<div className="flex items-center gap-1.5 sm:gap-2">
					<div className="flex -space-x-1.5 sm:-space-x-2">
						{eventPlayers.map((player) => (
							<div
								key={player.id}
								className="ring-2 ring-[var(--color-surface)]"
								style={{ borderRadius: "50%" }}
								title={getDisplayName(player)}
							>
								<Avatar src={player.pictureUrl ?? undefined} name={getDisplayName(player)} size={24} />
							</div>
						))}
					</div>
					<span className="text-xs text-gray-400">
						{playerCount} {playerCount === 1 ? "player" : "players"}
					</span>
				</div>
			) : (
				<div className="text-xs text-gray-500">No players added</div>
			)}
		</div>
	);
};
