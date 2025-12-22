import React, { useContext } from "react";
import { type User } from "firebase/auth";

interface AuthContextValue {
	user: User | null;
	loading: boolean;
}

export const AuthContext = React.createContext<AuthContextValue>({
	user: null,
	loading: true,
});

export const useAuth = () => {
	return useContext(AuthContext);
};
