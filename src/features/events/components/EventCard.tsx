import { CalendarDays, MapPin, Edit, Trash2, Users, Gamepad2 } from "lucide-react";
import type { IEvent } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";

interface IEventCardProps {
	event: IEvent;
	canEdit?: boolean;
	onEdit?: (event: IEvent) => void;
	onDelete?: (id: string) => void;
	players: IPlayer[];
	gameById: Map<string, IGame>;
}

export const EventCard: React.FC<IEventCardProps> = ({ event, canEdit, onEdit, onDelete, gameById }) => {
	const date = new Date(event.date);
	const dateLabel = isNaN(date.getTime())
		? event.date
		: date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

	const gameNames = event.gameIds.map((id) => gameById.get(id)?.name).filter(Boolean) as string[];

	const playerCount = event.playerIds?.length ?? 0;
	const gameCount = event.gameIds?.length ?? 0;

	return (
		<div className="group relative rounded-xl border border-gray-700 bg-[var(--color-surface)] p-3 shadow-sm transition-transform hover:-translate-y-0.5 sm:p-4">
			<div className="flex items-start gap-3">
				<div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-black/30">
					<CalendarDays className="h-5 w-5 text-gray-200" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<div className="inline-flex items-center gap-1 text-sm font-semibold text-white">
							<MapPin className="h-4 w-4 text-gray-300" />
							<span className="truncate">{event.location}</span>
						</div>
						<span className="text-xs text-gray-400">• {dateLabel}</span>
					</div>

					{gameNames.length > 0 && (
						<p className="mt-1 line-clamp-1 text-xs text-gray-300">{gameNames.join(", ")}</p>
					)}

					<div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
						<span className="inline-flex items-center gap-1 rounded-full border border-gray-700 bg-black/20 px-2 py-1 text-gray-300">
							<Gamepad2 className="h-3.5 w-3.5" /> {gameCount} {gameCount === 1 ? "game" : "games"}
						</span>
						<span className="inline-flex items-center gap-1 rounded-full border border-gray-700 bg-black/20 px-2 py-1 text-gray-300">
							<Users className="h-3.5 w-3.5" /> {playerCount} {playerCount === 1 ? "player" : "players"}
						</span>
					</div>
				</div>

				{canEdit && (
					<div className="ml-2 flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
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
		</div>
	);
};
