import React, { useContext } from "react";
import { type User } from "firebase/auth";

export const AuthContext = React.createContext<User | null>(null);

export const useAuth = () => {
	return useContext(AuthContext);
};
