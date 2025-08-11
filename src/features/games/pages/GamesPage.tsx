import { useModal } from "common/context/ModalContext";
import { GameForm } from "features/games/components/GameForm";
import { useGames } from "features/games/context/GamesContext";
import type { IGame } from "features/games/types";
import { ConfirmDelete } from "common/components/ConfirmDelete";
import { GameCard } from "features/games/components/GameCard";
import { useAuth } from "common/context/AuthContext";
import { Gamepad2, Plus } from "lucide-react";

const GamesPage: React.FC = () => {
	const { games, addGame, editGame, deleteGame } = useGames();
	const { openModal, closeModal } = useModal();
	const user = useAuth();

	const handleAdd = () => {
		openModal(
			<GameForm
				onSubmit={async (game: Omit<IGame, "id">) => {
					await addGame(game);
					closeModal();
				}}
			/>,
		);
	};

	const handleEdit = (game: IGame) => {
		openModal(
			<GameForm
				initialData={game}
				onSubmit={async (changes: Omit<IGame, "id">) => {
					await editGame(game.id, changes);
					closeModal();
				}}
			/>,
		);
	};

	const handleDelete = (game: IGame) => {
		openModal(
			<ConfirmDelete
				title="Delete game?"
				message={`This will remove ${game.name}.`}
				onConfirm={async () => {
					await deleteGame(game.id);
					closeModal();
				}}
				onCancel={closeModal}
			/>,
		);
	};

	return (
		<div className="mx-auto max-w-6xl px-4 py-6">
			<div className="mb-4 flex items-center justify-between gap-4">
				<div className="flex items-center gap-2 text-white">
					<Gamepad2 className="h-5 w-5" />
					<h1 className="text-base font-semibold">Games</h1>
					<span className="rounded-full border border-gray-700 px-2 py-0.5 text-xs text-gray-300">
						{games.length}
					</span>
				</div>
				{user && (
					<button
						onClick={handleAdd}
						className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-white/5"
					>
						<Plus className="h-4 w-4" /> Add Game
					</button>
				)}
			</div>

			{games.length === 0 ? (
				<div className="rounded-xl border border-gray-700 bg-[var(--color-surface)] p-8 text-center text-sm text-gray-400">
					No games yet. {user ? "Add your first game to get started." : "Sign in to add games."}
				</div>
			) : (
				<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{games.map((game) => (
						<li key={game.id} className="transition-transform hover:-translate-y-0.5">
							<GameCard
								game={game}
								canEdit={!!user}
								onEdit={() => handleEdit(game)}
								onDelete={() => handleDelete(game)}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default GamesPage;
