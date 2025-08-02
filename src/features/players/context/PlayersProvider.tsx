import { useEffect, useState, type PropsWithChildren } from "react";
import { db } from "firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import type { IPlayer } from "features/players/types";
import { createPlayer, updatePlayer, removePlayer } from "features/players/api";
import { PlayersContext } from "features/players/context/PlayersContext";

export const PlayersProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [players, setPlayers] = useState<IPlayer[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const q = query(collection(db, "players"));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as IPlayer[];
			setPlayers(data);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	async function addPlayer(player: Omit<IPlayer, "id">) {
		await createPlayer(player);
	}

	async function editPlayer(id: string, player: Partial<IPlayer>) {
		await updatePlayer(id, player);
	}

	async function deletePlayer(id: string) {
		await removePlayer(id);
	}

	return (
		<PlayersContext.Provider value={{ players, loading, addPlayer, editPlayer, deletePlayer }}>
			{children}
		</PlayersContext.Provider>
	);
};
