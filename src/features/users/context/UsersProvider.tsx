import { useState, useEffect, useMemo, type PropsWithChildren } from "react";
import { collection, onSnapshot, query, updateDoc, deleteDoc, doc, writeBatch, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { db, auth, secondaryAuth } from "firebase";
import { UsersContext } from "features/users/context/UsersContext";
import type { IUser } from "features/users/types";
import { createMapBy } from "common/utils/helpers";

export const UsersProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [users, setUsers] = useState<IUser[]>([]);
	const [loading, setLoading] = useState(true);

	// Real-time listener for users collection
	useEffect(() => {
		const q = query(collection(db, "users"));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const data = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as IUser[];
			// Sort alphabetically by email
			data.sort((a, b) => a.email.localeCompare(b.email));
			setUsers(data);
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const userById = useMemo(() => createMapBy(users, "id"), [users]);

	async function addUser(user: Omit<IUser, "id" | "createdAt">) {
		// Create Firebase Auth user using secondary auth instance
		// This prevents logging out the current admin user
		const tempPassword = Math.random().toString(36).slice(-16) + "A1!";
		const userCredential = await createUserWithEmailAndPassword(secondaryAuth, user.email, tempPassword);

		// Create user document in Firestore using Auth UID as document ID
		// Note: We don't store 'id' as a field - it's derived from the document ID
		await setDoc(doc(db, "users", userCredential.user.uid), {
			...user,
			createdAt: new Date().toISOString(),
		});

		// Send password reset email so user can set their own password
		// Use primary auth for this since it doesn't affect session
		await sendPasswordResetEmail(auth, user.email);
	}

	async function editUser(id: string, updates: Partial<IUser>) {
		await updateDoc(doc(db, "users", id), updates);
	}

	async function deleteUser(id: string) {
		// Note: This only deletes the Firestore document
		// Firebase Auth user deletion requires admin SDK or user re-authentication
		await deleteDoc(doc(db, "users", id));
	}

	async function linkUserToPlayer(userId: string, playerId: string) {
		const batch = writeBatch(db);

		// Update user document
		batch.update(doc(db, "users", userId), {
			linkedPlayerId: playerId,
		});

		// Update player document
		batch.update(doc(db, "players", playerId), {
			linkedUserId: userId,
		});

		await batch.commit();
	}

	async function unlinkUserFromPlayer(userId: string) {
		const user = userById.get(userId);
		if (!user?.linkedPlayerId) return;

		const batch = writeBatch(db);

		// Update user document
		batch.update(doc(db, "users", userId), {
			linkedPlayerId: null,
		});

		// Update player document
		batch.update(doc(db, "players", user.linkedPlayerId), {
			linkedUserId: null,
		});

		await batch.commit();
	}

	return (
		<UsersContext.Provider
			value={{
				users,
				userById,
				loading,
				addUser,
				editUser,
				deleteUser,
				linkUserToPlayer,
				unlinkUserFromPlayer,
			}}
		>
			{children}
		</UsersContext.Provider>
	);
};
