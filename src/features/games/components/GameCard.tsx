import { Edit, Trash2, Gamepad2 } from "lucide-react";
import type { IGame } from "features/games/types";

interface IGameCardProps {
	game: IGame;
	onEdit?: (game: IGame) => void;
	onDelete?: (id: string) => void;
}

export const GameCard: React.FC<IGameCardProps> = ({ game, onEdit, onDelete }) => {
	const handleDeleteClick = () => {
		if (game.id) onDelete?.(game.id);
	};

	return (
		<div className="flex items-center gap-4 rounded-xl border border-gray-800 bg-[var(--color-surface)] p-4 shadow-lg">
			<div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-700">
				<Gamepad2 size={28} className="text-gray-400" />
			</div>

			<div className="flex-1">
				<h3 className="text-lg font-semibold">{game.name}</h3>
			</div>

			<div className="flex gap-2">
				<button
					onClick={() => onEdit?.(game)}
					className="rounded p-2 transition-colors hover:bg-blue-500/20"
					title="Edit"
				>
					<Edit size={18} className="text-blue-400" />
				</button>
				<button
					onClick={handleDeleteClick}
					className="rounded p-2 transition-colors hover:bg-red-500/20"
					title="Delete"
				>
					<Trash2 size={18} className="text-red-400" />
				</button>
			</div>
		</div>
	);
};
