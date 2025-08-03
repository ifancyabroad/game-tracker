import { useModal } from "common/context/ModalContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { PlayerCard } from "features/players/components/PlayerCard";
import { PlayerForm } from "features/players/components/PlayerForm";
import type { IPlayer } from "features/players/types";
import { ConfirmDelete } from "common/components/ConfirmDelete";

const PlayersList: React.FC = () => {
	const { players, addPlayer, editPlayer, deletePlayer } = usePlayers();
	const { openModal, closeModal } = useModal();

	const handleAdd = () => {
		openModal(
			<PlayerForm
				onSubmit={(data) => {
					addPlayer(data);
					closeModal();
				}}
			/>,
		);
	};

	const handleEdit = (player: IPlayer) => {
		openModal(
			<PlayerForm
				initialData={player}
				onSubmit={(data) => {
					if (player.id) {
						editPlayer(player.id, data);
						closeModal();
					}
				}}
			/>,
		);
	};

	const handleDelete = (player: IPlayer) => {
		openModal(
			<ConfirmDelete
				title="Delete Player"
				message={`Are you sure you want to delete ${player.preferredName || player.firstName}?`}
				onConfirm={() => {
					deletePlayer(player.id);
					closeModal();
				}}
				onCancel={closeModal}
			/>,
		);
	};

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Players</h2>
				<button
					onClick={handleAdd}
					className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-[var(--color-primary-contrast)] transition-opacity hover:opacity-90"
				>
					+ Add Player
				</button>
			</div>

			{players.length === 0 ? (
				<p className="text-gray-500">No players found. Add a player to get started.</p>
			) : (
				<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{players.map((player) => (
						<li key={player.id}>
							<PlayerCard
								player={player}
								onEdit={() => handleEdit(player)}
								onDelete={() => handleDelete(player)}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default PlayersList;
