import { Edit, Trash2 } from "lucide-react";
import type { IPlayer } from "features/players/types";
import { Avatar, IconButton, Card } from "common/components";
import { Link } from "react-router";
import { getDisplayName, getFullName } from "features/players/utils/helpers";

interface PlayerCardProps {
	player: IPlayer;
	canEdit?: boolean;
	onEdit?: (player: IPlayer) => void;
	onDelete?: (id: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, canEdit, onEdit, onDelete }) => {
	const fullName = getFullName(player);
	const preferred = getDisplayName(player);
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
			<Card variant="interactive" className="group relative flex items-center gap-3 p-3 sm:p-4">
				<Avatar src={player.pictureUrl || undefined} name={preferred} size={48} />

				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-semibold text-white">{preferred}</p>
					{showFullBelow && <p className="truncate text-xs text-gray-400">{fullName}</p>}
				</div>

				<div
					className="h-4 w-4 flex-shrink-0 rounded-full border border-gray-700"
					style={{ backgroundColor: player.color }}
				/>

				{canEdit && (
					<div className="ml-auto flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
						<IconButton onClick={handleEdit} icon={<Edit />} title="Edit" />
						<IconButton onClick={handleDelete} icon={<Trash2 />} variant="danger" title="Delete" />
					</div>
				)}
			</Card>
		</Link>
	);
};
