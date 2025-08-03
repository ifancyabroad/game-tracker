import { Edit, Trash2, User } from "lucide-react";
import type { IPlayer } from "features/players/types";
import { useModal } from "common/context/ModalContext";
import { ConfirmDelete } from "common/components/ConfirmDelete";

interface IPlayerCardProps {
	player: IPlayer;
	onEdit?: (player: IPlayer) => void;
	onDelete?: (id: string) => void;
}

export const PlayerCard: React.FC<IPlayerCardProps> = ({ player, onEdit, onDelete }) => {
	const { openModal, closeModal } = useModal();
	const displayName = player.preferredName || `${player.firstName} ${player.lastName}`;
	const fullName = `${player.firstName} ${player.lastName}`;

	const handleDeleteClick = () => {
		openModal(
			<ConfirmDelete
				title="Delete Player"
				message={`Are you sure you want to delete ${player.preferredName || player.firstName}?`}
				onConfirm={() => {
					if (player.id) onDelete?.(player.id);
					closeModal();
				}}
				onCancel={closeModal}
			/>,
		);
	};

	return (
		<div className="flex items-center gap-4 rounded-xl border border-gray-800 bg-[var(--color-surface)] p-4 shadow-lg">
			{/* Avatar */}
			{player.pictureUrl ? (
				<img src={player.pictureUrl} alt={fullName} className="h-14 w-14 rounded-full object-cover" />
			) : (
				<div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-700">
					<User size={28} className="text-gray-400" />
				</div>
			)}

			{/* Player Info */}
			<div className="flex-1">
				<h3 className="text-lg font-semibold">{displayName}</h3>
				{player.preferredName && <p className="text-sm text-gray-400">({fullName})</p>}
			</div>

			{/* Actions */}
			<div className="flex gap-2">
				<button
					className="hover:bg-opacity-20 rounded p-2 transition-colors hover:bg-[var(--color-primary)]"
					onClick={() => onEdit?.(player)}
				>
					<Edit size={18} />
				</button>
				<button
					onClick={handleDeleteClick}
					className="hover:bg-opacity-20 rounded p-2 transition-colors hover:bg-red-500"
				>
					<Trash2 size={18} className="text-red-400" />
				</button>
			</div>
		</div>
	);
};
