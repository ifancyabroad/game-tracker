import { Edit, Trash2, User2 } from "lucide-react";
import type { IPlayer } from "features/players/types";

interface IPlayerCardProps {
	player: IPlayer;
	onEdit?: (player: IPlayer) => void;
	onDelete?: (id: string) => void;
}

export const PlayerCard: React.FC<IPlayerCardProps> = ({ player, onEdit, onDelete }) => {
	const displayName = player.preferredName || `${player.firstName} ${player.lastName}`;
	const fullName = `${player.firstName} ${player.lastName}`;

	const handleDeleteClick = () => {
		if (player.id) onDelete?.(player.id);
	};

	return (
		<div className="flex items-center gap-4 rounded-xl border border-gray-800 bg-[var(--color-surface)] p-4 shadow-lg">
			<div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-700">
				{player.pictureUrl ? (
					<img src={player.pictureUrl} alt={displayName} className="h-14 w-14 rounded-full object-cover" />
				) : (
					<User2 size={28} className="text-gray-400" />
				)}
			</div>

			<div className="flex-1">
				<h3 className="text-lg font-semibold">{displayName}</h3>
				{player.preferredName && <p className="text-sm text-gray-400">{fullName}</p>}
			</div>

			<div className="flex gap-2">
				<button
					onClick={() => onEdit?.(player)}
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
