import { type PropsWithChildren, useEffect, useState } from "react";
import { AuthContext } from "common/context/AuthContext";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "firebase";

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};
