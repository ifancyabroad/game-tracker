import { Edit, Trash2, Gamepad2 } from "lucide-react";
import type { IGame } from "features/games/types";

interface IGameCardProps {
	game: IGame;
	canEdit?: boolean;
	onEdit?: (game: IGame) => void;
	onDelete?: (id: string) => void;
}

export const GameCard: React.FC<IGameCardProps> = ({ game, canEdit, onEdit, onDelete }) => {
	const handleDeleteClick = () => {
		if (game.id) onDelete?.(game.id);
	};

	return (
		<div className="group relative flex items-center gap-4 rounded-xl border border-gray-700 bg-[var(--color-surface)] p-4 shadow-sm transition-transform hover:-translate-y-0.5">
			<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/30">
				<Gamepad2 className="h-5 w-5 text-[var(--color-primary)]" />
			</div>

			<div className="min-w-0">
				<p className="truncate text-sm font-semibold text-white">{game.name}</p>
			</div>

			{canEdit && (
				<div className="ml-auto flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
					<button
						onClick={() => onEdit?.(game)}
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
		</div>
	);
};
