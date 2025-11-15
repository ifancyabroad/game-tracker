import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "firebase";
import { GamesContext } from "./GamesContext";
import type { IGame } from "features/games/types";
import { createMapById } from "common/utils/helpers";

export const GamesProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [games, setGames] = useState<IGame[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onSnapshot(collection(db, "games"), (snapshot) => {
			const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as IGame[];
			data.sort((a, b) => a.name.localeCompare(b.name));
			setGames(data);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	const gameById = useMemo(() => createMapById(games), [games]);

	const addGame = async (game: Omit<IGame, "id">) => {
		await addDoc(collection(db, "games"), game);
	};

	const editGame = async (id: string, game: Omit<IGame, "id">) => {
		await updateDoc(doc(db, "games", id), game);
	};

	const deleteGame = async (id: string) => {
		await deleteDoc(doc(db, "games", id));
	};

	return (
		<GamesContext.Provider value={{ games, gameById, loading, addGame, editGame, deleteGame }}>
			{children}
		</GamesContext.Provider>
	);
};
