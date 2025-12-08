import { Edit, Trash2 } from "lucide-react";
import type { IGame } from "features/games/types";
import { useResults } from "features/events/context/ResultsContext";
import { Link } from "react-router";
import { GameTypeIcon } from "./GameTypeIcon";

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
		<Link
			to={`/games/${game.id}`}
			className="group relative flex items-center gap-3 rounded-xl border border-gray-700 bg-[var(--color-surface)] p-3 shadow-sm transition-transform hover:-translate-y-0.5 sm:gap-4 sm:p-4"
			aria-label={`View stats for ${game.name}`}
		>
			<div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-black/30">
				<GameTypeIcon type={game.type} className="h-5 w-5 text-[var(--color-primary)]" />
				<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[10px] font-bold text-[var(--color-secondary-contrast)]">
					{game.points}
				</span>
			</div>

			<div className="min-w-0">
				<p className="truncate text-sm font-semibold text-white">{game.name}</p>
				<p className="truncate text-xs text-gray-400">
					{numOfPlays} {numOfPlays === 1 ? "play" : "plays"}
				</p>
			</div>

			{canEdit && (
				<div className="ml-auto flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
					<button
						onClick={handleEditClick}
						className="rounded-lg border border-gray-700 bg-black/20 p-2 text-gray-200 hover:bg-white/10"
						title="Edit"
					>
						<Edit size={16} />
					</button>
					<button
						onClick={handleDeleteClick}
						className="rounded-lg border border-gray-700 bg-black/20 p-2 text-red-300 hover:bg-red-500/20"
						title="Delete"
					>
						<Trash2 size={16} />
					</button>
				</div>
			)}
		</Link>
	);
};
