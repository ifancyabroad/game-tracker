import { useEffect, useState, type PropsWithChildren } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "firebase";
import { EventsContext } from "./EventsContext";
import type { IEvent } from "features/events/types";

export const EventsProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [events, setEvents] = useState<IEvent[]>([]);

	useEffect(() => {
		const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
			const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as IEvent[];
			setEvents(data);
		});
		return () => unsubscribe();
	}, []);

	const addEvent = async (event: Omit<IEvent, "id">) => {
		await addDoc(collection(db, "events"), event);
	};

	const editEvent = async (id: string, event: Omit<IEvent, "id">) => {
		await updateDoc(doc(db, "events", id), event);
	};

	const deleteEvent = async (id: string) => {
		await deleteDoc(doc(db, "events", id));
	};

	return (
		<EventsContext.Provider value={{ events, addEvent, editEvent, deleteEvent }}>{children}</EventsContext.Provider>
	);
};
