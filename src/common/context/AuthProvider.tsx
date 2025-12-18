import { type PropsWithChildren, useEffect, useState } from "react";
import { AuthContext } from "common/context/AuthContext";
import { PageLoader } from "common/components";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "firebase";

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setIsLoaded(true);
		});

		return unsubscribe;
	}, []);

	if (!isLoaded) {
		return <PageLoader />;
	}

	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
