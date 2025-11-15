import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { db, storage } from "firebase";
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import type { IPlayer } from "features/players/types";
import { PlayersContext } from "features/players/context/PlayersContext";
import { getDisplayName } from "features/players/utils/helpers";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { createMapById } from "common/utils/helpers";

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

	const playerById = useMemo(() => createMapById(players), [players]);

	async function addPlayer(player: Omit<IPlayer, "id">) {
		await addDoc(collection(db, "players"), player);
	}

	async function editPlayer(id: string, player: Partial<IPlayer>) {
		await updateDoc(doc(db, "players", id), player);
	}

	async function deletePlayer(id: string) {
		await deleteDoc(doc(db, "players", id));
	}

	async function uploadImage(file: File) {
		const imageRef = ref(storage, `players/${file.name}-${Date.now()}`);
		await uploadBytes(imageRef, file, {
			cacheControl: "public,max-age=31536000",
		});
		return getDownloadURL(imageRef);
	}

	return (
		<PlayersContext.Provider
			value={{ players, playerById, loading, addPlayer, editPlayer, deletePlayer, uploadImage }}
		>
			{children}
		</PlayersContext.Provider>
	);
};
