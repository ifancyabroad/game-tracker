import { useModal } from "common/context/ModalContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { PlayerCard } from "features/players/components/PlayerCard";
import { PlayerForm } from "features/players/components/PlayerForm";
import type { IPlayer } from "features/players/types";

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

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Players</h2>
				<button
					onClick={handleAdd}
					className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-white transition-opacity hover:opacity-90"
				>
					+ Add Player
				</button>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{players.map((player) => (
					<PlayerCard
						key={player.id}
						player={player}
						onEdit={() => handleEdit(player)}
						onDelete={(id) => deletePlayer(id)}
					/>
				))}
			</div>
		</div>
	);
};

export default PlayersList;
