import { CalendarDays, MapPin, Edit, Trash2 } from "lucide-react";
import type { IEvent } from "features/events/types";
import type { IPlayer } from "features/players/types";
import type { IGame } from "features/games/types";
import { Avatar, IconButton, Card } from "common/components";
import { GameTypeIcon } from "features/games/components/GameTypeIcon";
import { getDisplayName } from "features/players/utils/helpers";
import { pluralize } from "common/utils/helpers";

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
		<Card variant="interactive" className="group relative cursor-pointer p-3 sm:p-4">
			{/* Header: Location & Date */}
			<div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
				<div className="min-w-0 flex-1">
					<div className="mb-0.5 flex items-center gap-1.5 sm:mb-1">
						<MapPin className="h-4 w-4 flex-shrink-0 text-[var(--color-primary)]" />
						<h3 className="truncate text-sm font-bold text-[var(--color-text)] md:text-base">
							{event.location}
						</h3>
					</div>
					<div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
						<CalendarDays className="h-3.5 w-3.5" />
						<time>{dateLabel}</time>
					</div>
				</div>

				{/* Action Buttons */}
				{canEdit && (
					<div className="flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
						<IconButton
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onEdit?.(event);
							}}
							icon={<Edit />}
							variant="secondary"
							title="Edit"
						/>
						<IconButton
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onDelete?.(event.id);
							}}
							icon={<Trash2 />}
							variant="danger"
							title="Delete"
						/>
					</div>
				)}
			</div>

			{/* Games Section */}
			{games.length > 0 ? (
				<div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-3">
					{games.map((game) => (
						<span
							key={game.id}
							className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-accent)] px-2 py-1 text-xs font-medium text-[var(--color-text)]"
						>
							<GameTypeIcon type={game.type} className="h-3 w-3" />
							{game.name}
						</span>
					))}
				</div>
			) : (
				<div className="mb-2 text-xs text-[var(--color-text-muted)] sm:mb-3">No games added</div>
			)}

			{/* Players Section */}
			{eventPlayers.length > 0 ? (
				<div className="flex items-center gap-2">
					<div className="flex -space-x-2">
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
					<span className="text-xs text-[var(--color-text-secondary)]">
						{playerCount} {pluralize(playerCount, "player")}
					</span>
				</div>
			) : (
				<div className="text-xs text-[var(--color-text-muted)]">No players added</div>
			)}
		</Card>
	);
};
