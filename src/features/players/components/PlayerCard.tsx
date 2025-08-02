import type { IPlayer } from "features/players/types";

interface PlayerCardProps {
	player: IPlayer;
	onEdit?: () => void;
	onDelete?: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onEdit, onDelete }) => {
	return (
		<div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow">
			{player.pictureUrl && (
				<img
					src={player.pictureUrl}
					alt={player.preferredName}
					className="h-16 w-16 rounded-full object-cover"
				/>
			)}
			<div className="flex-1">
				<h2 className="text-lg font-bold">{player.preferredName}</h2>
				<p className="text-gray-600">
					{player.firstName} {player.lastName}
				</p>
			</div>
			<div className="flex gap-2">
				{onEdit && (
					<button onClick={onEdit} className="text-blue-600">
						Edit
					</button>
				)}
				{onDelete && (
					<button onClick={onDelete} className="text-red-600">
						Delete
					</button>
				)}
			</div>
		</div>
	);
};
