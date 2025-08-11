import { useModal } from "common/context/ModalContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { PlayerCard } from "features/players/components/PlayerCard";
import { PlayerForm } from "features/players/components/PlayerForm";
import type { IPlayer } from "features/players/types";
import { ConfirmDelete } from "common/components/ConfirmDelete";
import { useAuth } from "common/context/AuthContext";
import { Users, Plus } from "lucide-react";

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
				message={`This will remove ${player.preferredName ?? player.firstName}.`}
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
			<div className="mb-4 flex items-center justify-between gap-4">
				<div className="flex items-center gap-2 text-white">
					<Users className="h-5 w-5 text-[var(--color-primary)]" />
					<h1 className="text-base font-semibold">Players</h1>
					<span className="rounded-full border border-gray-700 px-2 py-0.5 text-xs text-gray-300">
						{players.length}
					</span>
				</div>
				{user && (
					<button
						onClick={handleAdd}
						className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[var(--color-primary)]/10"
					>
						<Plus className="h-4 w-4" /> Add Player
					</button>
				)}
			</div>

			{players.length === 0 ? (
				<div className="rounded-xl border border-gray-700 bg-[var(--color-surface)] p-8 text-center text-sm text-gray-400">
					No players yet. {user ? "Add your first player to get started." : "Sign in to add players."}
				</div>
			) : (
				<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
