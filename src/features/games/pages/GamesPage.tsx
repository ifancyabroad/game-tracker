import { useModal } from "common/context/ModalContext";
import { GameForm } from "features/games/components/GameForm";
import { useGames } from "features/games/context/GamesContext";
import type { IGame } from "features/games/types";
import { ConfirmDelete } from "common/components/ConfirmDelete";
import { GameCard } from "features/games/components/GameCard";

const GamesPage: React.FC = () => {
	const { games, addGame, editGame, deleteGame } = useGames();
	const { openModal, closeModal } = useModal();

	const handleAdd = () => {
		openModal(
			<GameForm
				onSubmit={async (data) => {
					await addGame(data);
					closeModal();
				}}
			/>,
		);
	};

	const handleEdit = (game: IGame) => {
		openModal(
			<GameForm
				initialData={game}
				onSubmit={async (data) => {
					await editGame(game.id, data);
					closeModal();
				}}
			/>,
		);
	};

	const handleDelete = (game: IGame) => {
		openModal(
			<ConfirmDelete
				title="Delete Game"
				message={`Are you sure you want to delete "${game.name}"?`}
				onConfirm={() => {
					deleteGame(game.id);
					closeModal();
				}}
				onCancel={closeModal}
			/>,
		);
	};

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Games</h2>
				<button
					onClick={handleAdd}
					className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-[var(--color-primary-contrast)] transition-opacity hover:opacity-90"
				>
					+ Add Game
				</button>
			</div>

			{games.length === 0 ? (
				<p className="text-gray-400">No games added yet.</p>
			) : (
				<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{games.map((game) => (
						<li key={game.id}>
							<GameCard game={game} onEdit={() => handleEdit(game)} onDelete={() => handleDelete(game)} />
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
export default GamesPage;
