import { useEffect, useState, type PropsWithChildren } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "firebase";
import { GamesContext } from "./GamesContext";
import type { IGame } from "features/games/types";

export const GamesProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [games, setGames] = useState<IGame[]>([]);

	useEffect(() => {
		const unsubscribe = onSnapshot(collection(db, "games"), (snapshot) => {
			const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as IGame[];
			setGames(data);
		});
		return () => unsubscribe();
	}, []);

	const addGame = async (game: Omit<IGame, "id">) => {
		await addDoc(collection(db, "games"), game);
	};

	const editGame = async (id: string, game: Omit<IGame, "id">) => {
		await updateDoc(doc(db, "games", id), game);
	};

	const deleteGame = async (id: string) => {
		await deleteDoc(doc(db, "games", id));
	};

	return <GamesContext.Provider value={{ games, addGame, editGame, deleteGame }}>{children}</GamesContext.Provider>;
};
