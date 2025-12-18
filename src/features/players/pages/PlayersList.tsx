import { useModal } from "common/context/ModalContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { PlayerCard } from "features/players/components/PlayerCard";
import { PlayerForm } from "features/players/components/PlayerForm";
import type { IPlayer } from "features/players/types";
import { ConfirmDelete, Button, PageHeader, EmptyState } from "common/components";
import { useAuth } from "common/context/AuthContext";
import { Users, Plus } from "lucide-react";
import { getDisplayName } from "features/players/utils/helpers";

const PlayersList: React.FC = () => {
	const { players, addPlayer, editPlayer, deletePlayer } = usePlayers();
	const { openModal, closeModal } = useModal();
	const user = useAuth();

	const handleAdd = () => {
		openModal(
			<PlayerForm
				onSubmit={async (player: Omit<IPlayer, "id">) => {
					await addPlayer(player);
					closeModal();
				}}
			/>,
		);
	};

	const handleEdit = (player: IPlayer) => {
		openModal(
			<PlayerForm
				initialData={player}
				onSubmit={async (changes: Omit<IPlayer, "id">) => {
					await editPlayer(player.id, changes);
					closeModal();
				}}
			/>,
		);
	};

	const handleDelete = (player: IPlayer) => {
		openModal(
			<ConfirmDelete
				title="Delete player?"
				message={`This will remove ${getDisplayName(player)}.`}
				onConfirm={async () => {
					await deletePlayer(player.id);
					closeModal();
				}}
				onCancel={closeModal}
			/>,
		);
	};

	return (
		<div className="mx-auto max-w-6xl">
			<PageHeader
				icon={<Users />}
				title="Players"
				count={players.length}
				action={
					user ? (
						<Button onClick={handleAdd} variant="secondary" size="md">
							<Plus className="h-4 w-4" /> Add Player
						</Button>
					) : undefined
				}
			/>

			{players.length === 0 ? (
				<EmptyState>
					No players yet. {user ? "Add your first player to get started." : "Sign in to add players."}
				</EmptyState>
			) : (
				<ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
					{players.map((player) => (
						<li key={player.id} className="transition-transform hover:-translate-y-0.5">
							<PlayerCard
								player={player}
								canEdit={!!user}
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
