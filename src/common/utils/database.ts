import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "firebase";
import type { IPlayer } from "types/models";

export const getPlayers = async () => {
	try {
		const playersCollection = collection(db, "players");
		const playersSnapshot = await getDocs(playersCollection);
		return playersSnapshot.docs.map(
			(doc) =>
				({
					id: doc.id,
					...doc.data(),
				}) as IPlayer,
		);
	} catch (error) {
		console.error("Error getting players: ", error);
		return [];
	}
};

export const getPlayer = async (id: string) => {
	try {
		const playerDoc = doc(db, "players", id);
		const playerSnapshot = await getDoc(playerDoc);
		return { id: playerSnapshot.id, ...playerSnapshot.data() } as IPlayer;
	} catch (error) {
		console.error("Error getting player: ", error);
		return null;
	}
};

export const updatePlayer = async (id: string, data: Partial<IPlayer>) => {
	try {
		const playerDoc = doc(db, "players", id);
		await setDoc(playerDoc, data, { merge: true });
	} catch (error) {
		console.error("Error updating player: ", error);
	}
};
