import { useModal } from "common/context/ModalContext";
import { GameForm } from "features/games/components/GameForm";
import { useGames } from "features/games/context/GamesContext";
import type { IGame } from "features/games/types";
import { ConfirmDelete, Button, PageHeader, EmptyState } from "common/components";
import { GameCard } from "features/games/components/GameCard";
import { useAuth } from "common/context/AuthContext";
import { Gamepad2, Plus } from "lucide-react";
import { useToast } from "common/utils/hooks";

const GamesPage: React.FC = () => {
	const { games, addGame, editGame, deleteGame } = useGames();
	const { openModal, closeModal } = useModal();
	const { user } = useAuth();
	const toast = useToast();

	const handleAddGame = async (game: Omit<IGame, "id">) => {
		try {
			await addGame(game);
			toast.success("Game added successfully");
			closeModal();
		} catch {
			toast.error("Failed to add game");
		}
	};

	const handleEditGame = async (game: IGame, changes: Omit<IGame, "id">) => {
		try {
			await editGame(game.id, changes);
			toast.success("Game updated successfully");
			closeModal();
		} catch {
			toast.error("Failed to update game");
		}
	};

	const handleDeleteGame = async (game: IGame) => {
		try {
			await deleteGame(game.id);
			toast.success("Game deleted successfully");
			closeModal();
		} catch {
			toast.error("Failed to delete game");
		}
	};

	const handleAdd = () => {
		openModal(<GameForm onSubmit={(game) => handleAddGame(game)} />);
	};

	const handleEdit = (game: IGame) => {
		openModal(<GameForm initialData={game} onSubmit={(changes) => handleEditGame(game, changes)} />);
	};

	const handleDelete = (game: IGame) => {
		openModal(
			<ConfirmDelete
				title="Delete game?"
				message={`This will remove ${game.name}.`}
				onConfirm={() => handleDeleteGame(game)}
				onCancel={closeModal}
			/>,
		);
	};

	return (
		<div className="mx-auto max-w-6xl">
			<PageHeader
				icon={<Gamepad2 />}
				title="Games"
				count={games.length}
				action={
					user ? (
						<Button onClick={handleAdd} variant="primary" size="md">
							<Plus className="h-4 w-4" /> Add Game
						</Button>
					) : undefined
				}
			/>

			{games.length === 0 ? (
				<EmptyState>
					No games yet. {user ? "Add your first game to get started." : "Sign in to add games."}
				</EmptyState>
			) : (
				<ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
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
