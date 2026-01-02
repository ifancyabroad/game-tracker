import React, { useContext } from "react";
import { type User } from "firebase/auth";
import type { IUser } from "features/users/types";

interface AuthContextValue {
	authUser: User | null; // Firebase Auth user
	user: IUser | null; // Firestore user document with role
	loading: boolean;
	isAdmin: boolean; // Computed: user has admin role
	canEdit: boolean; // Computed: user can edit (currently same as admin)
	currentUserPlayerId: string | null; // Computed: player ID linked to current user
}

export const AuthContext = React.createContext<AuthContextValue>({
	authUser: null,
	user: null,
	loading: true,
	isAdmin: false,
	canEdit: false,
	currentUserPlayerId: null,
});

export const useAuth = () => {
	return useContext(AuthContext);
};
