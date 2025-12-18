import { Edit, Trash2 } from "lucide-react";
import type { IGame } from "features/games/types";
import { useResults } from "features/events/context/ResultsContext";
import { Link } from "react-router";
import { GameTypeIcon } from "./GameTypeIcon";
import { IconButton, Card } from "common/components";

interface IGameCardProps {
	game: IGame;
	canEdit?: boolean;
	onEdit?: (game: IGame) => void;
	onDelete?: (id: string) => void;
}

export const GameCard: React.FC<IGameCardProps> = ({ game, canEdit, onEdit, onDelete }) => {
	const { results } = useResults();
	const numOfPlays = results.filter((r) => r.gameId === game.id).length;

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (game.id) onDelete?.(game.id);
	};

	const handleEditClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onEdit?.(game);
	};

	return (
		<Link to={`/games/${game.id}`} aria-label={`View stats for ${game.name}`}>
			<Card variant="interactive" className="group relative flex items-center gap-3 p-3 sm:p-4">
				<div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-black/30">
					<GameTypeIcon type={game.type} className="h-5 w-5 text-[var(--color-primary)]" />
					<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[10px] font-bold text-[var(--color-secondary-contrast)]">
						{game.points}
					</span>
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-semibold text-white">{game.name}</p>
					<p className="truncate text-xs text-gray-400">
						{numOfPlays} {numOfPlays === 1 ? "play" : "plays"}
					</p>
				</div>
				<div
					className="h-4 w-4 flex-shrink-0 rounded-full border border-gray-700"
					style={{ backgroundColor: game.color }}
				/>
				{canEdit && (
					<div className="ml-auto flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
						<IconButton onClick={handleEditClick} icon={<Edit />} title="Edit" />
						<IconButton onClick={handleDeleteClick} icon={<Trash2 />} variant="danger" title="Delete" />
					</div>
				)}
			</Card>
		</Link>
	);
};
