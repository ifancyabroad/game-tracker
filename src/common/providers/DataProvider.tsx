import { type PropsWithChildren, useEffect, useState } from "react";
import { PageLoader } from "common/components/PageLoader";
import { db } from "firebase";
import { collection, onSnapshot } from "firebase/firestore";
import type { IPlayer } from "types/models";
import { DataContext } from "common/context/DataContext";

export const DataProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [players, setPlayers] = useState<IPlayer[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const unsubscribe = onSnapshot(
			collection(db, "players"),
			(snapshot) => {
				const data = snapshot.docs.map(
					(doc) =>
						({
							id: doc.id,
							...doc.data(),
						}) as IPlayer,
				);
				setPlayers(data);
				setIsLoaded(true);
			},
			(error) => {
				console.error("Error getting players: ", error);
			},
		);

		return unsubscribe;
	}, []);

	if (!isLoaded) {
		return <PageLoader />;
	}

	return <DataContext.Provider value={players}>{children}</DataContext.Provider>;
};
