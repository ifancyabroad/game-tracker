import { Edit, Trash2 } from "lucide-react";
import type { IGame } from "features/games/types";
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
				<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]">
					<GameTypeIcon type={game.type} className="h-5 w-5 text-[var(--color-primary)]" />
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-bold text-[var(--color-text)] md:text-base">{game.name}</p>
					<p className="truncate text-xs text-[var(--color-text-secondary)]">
						{game.points} {game.points === 1 ? "point" : "points"}
					</p>
				</div>
				<div
					className="h-4 w-4 flex-shrink-0 rounded-full border border-[var(--color-border)]"
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
