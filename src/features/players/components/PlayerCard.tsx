import { Edit, Trash2 } from "lucide-react";
import type { IPlayer } from "features/players/types";
import { Avatar } from "common/components/Avatar";
import { Link } from "react-router";

interface PlayerCardProps {
	player: IPlayer;
	canEdit?: boolean;
	onEdit?: (player: IPlayer) => void;
	onDelete?: (id: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, canEdit, onEdit, onDelete }) => {
	const fullName = `${player.firstName} ${player.lastName}`;
	const preferred = player.preferredName ?? fullName;
	const showFullBelow = !!player.preferredName && player.preferredName !== fullName;

	const handleEdit = (e: React.MouseEvent) => {
		e.preventDefault();
		onEdit?.(player);
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.preventDefault();
		onDelete?.(player.id);
	};

	return (
		<Link to={`/players/${player.id}`} aria-label={`View stats for ${preferred}`}>
			<div className="group relative flex items-center gap-4 rounded-xl border border-gray-700 bg-[var(--color-surface)] p-4 shadow-sm transition-transform hover:-translate-y-0.5">
				<Avatar src={player.pictureUrl || undefined} name={preferred} size={48} />

				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-semibold text-white">{preferred}</p>
					{showFullBelow && <p className="truncate text-xs text-gray-400">{fullName}</p>}
				</div>

				{canEdit && (
					<div className="ml-auto flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
						<button
							onClick={handleEdit}
							className="rounded-lg border border-gray-700 bg-black/20 p-2 text-gray-200 hover:bg-white/10"
							title="Edit"
						>
							<Edit size={16} />
						</button>
						<button
							onClick={handleDelete}
							className="rounded-lg border border-gray-700 bg-black/20 p-2 text-red-300 hover:bg-red-500/20"
							title="Delete"
						>
							<Trash2 size={16} />
						</button>
					</div>
				)}
			</div>
		</Link>
	);
};
