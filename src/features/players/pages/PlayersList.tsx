import { useModal } from "common/context/ModalContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { useToast } from "common/utils/hooks";
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
	const toast = useToast();

	const handleAddPlayer = async (player: Omit<IPlayer, "id">) => {
		try {
			await addPlayer(player);
			toast.success("Player added successfully");
			closeModal();
		} catch {
			toast.error("Failed to add player");
		}
	};

	const handleEditPlayer = async (player: IPlayer, changes: Omit<IPlayer, "id">) => {
		try {
			await editPlayer(player.id, changes);
			toast.success("Player updated successfully");
			closeModal();
		} catch {
			toast.error("Failed to update player");
		}
	};

	const handleDeletePlayer = async (player: IPlayer) => {
		try {
			await deletePlayer(player.id);
			toast.success("Player deleted successfully");
			closeModal();
		} catch {
			toast.error("Failed to delete player");
		}
	};

	const handleAdd = () => {
		openModal(<PlayerForm onSubmit={(player) => handleAddPlayer(player)} />);
	};

	const handleEdit = (player: IPlayer) => {
		openModal(<PlayerForm initialData={player} onSubmit={(changes) => handleEditPlayer(player, changes)} />);
	};

	const handleDelete = (player: IPlayer) => {
		openModal(
			<ConfirmDelete
				title="Delete player?"
				message={`This will remove ${getDisplayName(player)}.`}
				onConfirm={() => handleDeletePlayer(player)}
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
