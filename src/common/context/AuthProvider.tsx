import { type PropsWithChildren, useEffect, useState, useMemo } from "react";
import { AuthContext } from "common/context/AuthContext";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "firebase";
import type { IUser } from "features/users/types";

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [authUser, setAuthUser] = useState<User | null>(null);
	const [user, setUser] = useState<IUser | null>(null);
	const [loading, setLoading] = useState(true);

	// Compute permission values
	const isAdmin = useMemo(() => user?.role === "admin", [user]);
	const canEdit = useMemo(() => user?.role === "admin", [user]);
	const currentUserPlayerId = useMemo(() => user?.linkedPlayerId || null, [user]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			setAuthUser(firebaseUser);

			if (!firebaseUser) {
				setUser(null);
				setLoading(false);
			}
		});

		return unsubscribe;
	}, []);

	// Listen to user document for role and profile data
	useEffect(() => {
		if (!authUser) {
			return;
		}

		const userDocRef = doc(db, "users", authUser.uid);
		const unsubscribe = onSnapshot(
			userDocRef,
			(snapshot) => {
				if (snapshot.exists()) {
					setUser({ id: snapshot.id, ...snapshot.data() } as IUser);
				} else {
					// User authenticated but no Firestore document
					console.warn("Authenticated user has no Firestore document");
					setUser(null);
				}
				setLoading(false);
			},
			(error) => {
				console.error("Error fetching user document:", error);
				setUser(null);
				setLoading(false);
			},
		);

		return unsubscribe;
	}, [authUser]);

	return (
		<AuthContext.Provider value={{ authUser, user, loading, isAdmin, canEdit, currentUserPlayerId }}>
			{children}
		</AuthContext.Provider>
	);
};
