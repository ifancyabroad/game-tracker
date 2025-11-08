import { useEffect, useState, type PropsWithChildren } from "react";
import { db } from "firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import type { IPlayer } from "features/players/types";
import { createPlayer, updatePlayer, removePlayer, uploadPlayerImage } from "features/players/api";
import { PlayersContext } from "features/players/context/PlayersContext";
import { getDisplayName } from "features/players/utils/helpers";

export const PlayersProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [players, setPlayers] = useState<IPlayer[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const q = query(collection(db, "players"));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as IPlayer[];
			data.sort((a, b) => {
				const nameA = getDisplayName(a);
				const nameB = getDisplayName(b);
				return nameA.localeCompare(nameB);
			});
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

	async function uploadImage(file: File) {
		const imageUrl = await uploadPlayerImage(file);
		return imageUrl;
	}

	return (
		<PlayersContext.Provider value={{ players, loading, addPlayer, editPlayer, deletePlayer, uploadImage }}>
			{children}
		</PlayersContext.Provider>
	);
};
