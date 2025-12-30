import { Link } from "react-router";
import { MapPin, Users } from "lucide-react";
import { Card } from "common/components";
import type { IEvent } from "features/events/types";
import type { IGame } from "features/games/types";

interface IEventCardProps {
	event: IEvent;
	gameById: Map<string, IGame>;
	playerCount: number;
}

export const EventCard: React.FC<IEventCardProps> = ({ event, gameById, playerCount }) => {
	const date = new Date(event.date);
	const dateLabel = isNaN(date.getTime())
		? event.date
		: date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

	const games = event.gameIds.map((id) => gameById.get(id)).filter(Boolean) as IGame[];
	const gameCount = games.length;

	return (
		<Link to={`/events/${event.id}`}>
			<Card variant="interactive" className="p-4 transition-all hover:shadow-lg">
				{/* Date Badge */}
				<div className="mb-3 inline-block rounded-md bg-[var(--color-primary)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-primary)]">
					{dateLabel}
				</div>

				{/* Location */}
				<div className="mb-3 flex items-center gap-2">
					<MapPin className="h-5 w-5 flex-shrink-0 text-[var(--color-text-secondary)]" />
					<h3 className="truncate text-base font-bold text-[var(--color-text)]">{event.location}</h3>
				</div>

				{/* Stats */}
				<div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
					<div className="flex items-center gap-1.5">
						<Users className="h-4 w-4" />
						<span>
							{playerCount} {playerCount === 1 ? "player" : "players"}
						</span>
					</div>
					<div className="h-1 w-1 rounded-full bg-[var(--color-text-secondary)]" />
					<span>
						{gameCount} {gameCount === 1 ? "game" : "games"}
					</span>
				</div>
			</Card>
		</Link>
	);
};
