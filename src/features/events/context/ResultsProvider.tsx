import { useEffect, useState, type PropsWithChildren } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "firebase";
import { ResultsContext } from "./ResultsContext";
import type { IResult } from "features/events/types";

export const ResultsProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [results, setResults] = useState<IResult[]>([]);

	useEffect(() => {
		const unsubscribe = onSnapshot(collection(db, "results"), (snapshot) => {
			const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as IResult[];
			setResults(data);
		});
		return () => unsubscribe();
	}, []);

	const addResult = async (result: Omit<IResult, "id">) => {
		await addDoc(collection(db, "results"), result);
	};

	const editResult = async (id: string, result: Omit<IResult, "id">) => {
		await updateDoc(doc(db, "results", id), result);
	};

	const deleteResult = async (id: string) => {
		await deleteDoc(doc(db, "results", id));
	};

	return (
		<ResultsContext.Provider value={{ results, addResult, editResult, deleteResult }}>
			{children}
		</ResultsContext.Provider>
	);
};
