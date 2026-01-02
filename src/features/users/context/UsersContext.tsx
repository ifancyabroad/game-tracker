import { createContext, useContext } from "react";
import type { IUser } from "features/users/types";

export interface UsersContextValue {
	users: IUser[];
	userById: Map<string, IUser>;
	loading: boolean;
	addUser: (user: Omit<IUser, "id" | "createdAt">) => Promise<void>;
	editUser: (id: string, user: Partial<IUser>) => Promise<void>;
	deleteUser: (id: string) => Promise<void>;
	linkUserToPlayer: (userId: string, playerId: string) => Promise<void>;
	unlinkUserFromPlayer: (userId: string) => Promise<void>;
}

export const UsersContext = createContext<UsersContextValue | undefined>(undefined);

export const useUsers = () => {
	const context = useContext(UsersContext);
	if (!context) {
		throw new Error("useUsers must be used inside <UsersProvider>");
	}
	return context;
};
