import { Link } from "react-router";
import { MapPin, ArrowRight } from "lucide-react";
import { Card } from "common/components";
import { useResults } from "features/events/context/ResultsContext";
import type { IEvent } from "features/events/types";

interface IEventCardProps {
	event: IEvent;
}

export const EventCard: React.FC<IEventCardProps> = ({ event }) => {
	const { results } = useResults();

	const date = new Date(event.date);
	const dateLabel = isNaN(date.getTime())
		? event.date
		: date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

	const gameCount = event.gameIds.length;
	const playerCount = event.playerIds?.length || 0;
	const resultsCount = results.filter((r) => r.eventId === event.id).length;

	// Truncate notes to ~100 characters
	const maxLength = 100;
	const hasNotes = event.notes && event.notes.trim().length > 0;
	const truncatedNotes = hasNotes
		? event.notes!.length > maxLength
			? event.notes!.substring(0, maxLength).trim() + "..."
			: event.notes
		: null;

	return (
		<Link to={`/events/${event.id}`}>
			<Card variant="interactive" className="flex h-full flex-col p-4 transition-all hover:shadow-lg">
				{/* Header: Date and Location */}
				<div className="mb-3">
					<div className="mb-1.5 inline-block rounded-md bg-[var(--color-primary)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-primary)]">
						{dateLabel}
					</div>
					<div className="flex items-center gap-2">
						<MapPin className="h-4 w-4 flex-shrink-0 text-[var(--color-text-secondary)]" />
						<h3 className="truncate font-bold text-[var(--color-text)]">{event.location}</h3>
					</div>
				</div>

				{/* Notes Preview */}
				{hasNotes && (
					<div className="mb-3 flex-grow">
						<p className="line-clamp-2 text-sm text-[var(--color-text-secondary)]">{truncatedNotes}</p>
					</div>
				)}

				{/* Stats Grid */}
				<div className="mb-3 grid grid-cols-3 gap-2 text-center">
					<div className="rounded-lg bg-[var(--color-accent)] p-2">
						<p className="text-lg font-bold text-[var(--color-text)] md:text-xl">{playerCount}</p>
						<p className="text-xs text-[var(--color-text-secondary)]">
							{playerCount === 1 ? "Player" : "Players"}
						</p>
					</div>
					<div className="rounded-lg bg-[var(--color-accent)] p-2">
						<p className="text-lg font-bold text-[var(--color-text)] md:text-xl">{gameCount}</p>
						<p className="text-xs text-[var(--color-text-secondary)]">
							{gameCount === 1 ? "Game" : "Games"}
						</p>
					</div>
					<div className="rounded-lg bg-[var(--color-accent)] p-2">
						<p className="text-lg font-bold text-[var(--color-text)] md:text-xl">{resultsCount}</p>
						<p className="text-xs text-[var(--color-text-secondary)]">
							{resultsCount === 1 ? "Result" : "Results"}
						</p>
					</div>
				</div>

				{/* Read More Link */}
				<div className="flex items-center justify-end gap-1 text-xs font-medium text-[var(--color-primary)]">
					<span>Read More</span>
					<ArrowRight className="h-3 w-3" />
				</div>
			</Card>
		</Link>
	);
};
