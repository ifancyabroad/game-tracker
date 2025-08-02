import { db, storage } from "firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { IPlayer } from "features/players/types";

const playersCol = collection(db, "players");

export async function fetchPlayers(): Promise<IPlayer[]> {
	const snapshot = await getDocs(playersCol);
	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as IPlayer[];
}

export async function createPlayer(player: Omit<IPlayer, "id">) {
	await addDoc(playersCol, player);
}

export async function updatePlayer(id: string, data: Partial<IPlayer>) {
	await updateDoc(doc(playersCol, id), data);
}

export async function removePlayer(id: string) {
	await deleteDoc(doc(playersCol, id));
}

export async function uploadPlayerImage(file: File) {
	const imageRef = ref(storage, `players/${file.name}-${Date.now()}`);
	await uploadBytes(imageRef, file);
	return getDownloadURL(imageRef);
}
