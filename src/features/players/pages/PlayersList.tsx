import { PlayerCard } from "features/players/components/PlayerCard";
import { PlayerForm } from "features/players/components/PlayerForm";
import { usePlayers } from "features/players/context/PlayersContext";

const PlayersList: React.FC = () => {
	const { players, loading, addPlayer, deletePlayer } = usePlayers();

	return (
		<div className="mx-auto max-w-2xl p-6">
			<h1 className="mb-4 text-2xl font-bold">Players</h1>

			<PlayerForm onSubmit={addPlayer} />

			<div className="mt-6 flex flex-col gap-4">
				{loading ? (
					<p>Loading players...</p>
				) : players.length === 0 ? (
					<p>No players added yet.</p>
				) : (
					players.map((p) => <PlayerCard key={p.id} player={p} onDelete={() => deletePlayer(p.id)} />)
				)}
			</div>
		</div>
	);
};

export default PlayersList;
