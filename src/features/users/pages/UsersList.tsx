import { Plus, UserCog } from "lucide-react";
import { PageHeader, Button, EmptyState, ConfirmDelete } from "common/components";
import { useModal } from "common/context/ModalContext";
import { useToast } from "common/utils/hooks";
import { useUsers } from "features/users/context/UsersContext";
import { UserCard } from "features/users/components/UserCard";
import { UserForm } from "features/users/components/UserForm";
import type { IUser } from "features/users/types";

export function UsersList() {
	const { users, addUser, editUser, deleteUser, unlinkUserFromPlayer } = useUsers();
	const { openModal, closeModal } = useModal();
	const toast = useToast();

	async function handleAddUser(data: { email: string; role: "admin" | "user"; linkedPlayerId: string | null }) {
		try {
			await addUser(data);
			toast.success(`User created! A password setup email has been sent to ${data.email}`);
			closeModal();
		} catch (error) {
			toast.error("Failed to create user");
			console.error(error);
			throw error;
		}
	}

	async function handleEditUser(user: IUser, updates: Partial<IUser>) {
		try {
			// Check if player link is being removed
			const wasLinked = user.linkedPlayerId !== null;
			const nowUnlinked = updates.linkedPlayerId === null;

			if (wasLinked && nowUnlinked) {
				// Show warning before unlinking
				openModal(
					<ConfirmDelete
						title="Unlink Player?"
						message={`This will remove the link between this user and their player profile. The user account will remain active, but stats will no longer be personalized. This action can be reversed.`}
						onConfirm={async () => {
							try {
								await unlinkUserFromPlayer(user.id);
								// Apply other updates
								const otherUpdates = Object.fromEntries(
									Object.entries(updates).filter(([key]) => key !== "linkedPlayerId"),
								);
								if (Object.keys(otherUpdates).length > 0) {
									await editUser(user.id, otherUpdates);
								}
								toast.success("User updated successfully");
								closeModal();
							} catch (error) {
								toast.error("Failed to update user");
								console.error(error);
								throw error;
							}
						}}
						onCancel={closeModal}
					/>,
				);
			} else {
				await editUser(user.id, updates);
				toast.success("User updated successfully");
				closeModal();
			}
		} catch (error) {
			toast.error("Failed to update user");
			console.error(error);
			throw error;
		}
	}

	async function handleDeleteUser(user: IUser) {
		try {
			// If user is linked to a player, unlink first
			if (user.linkedPlayerId) {
				await unlinkUserFromPlayer(user.id);
			}
			await deleteUser(user.id);
			toast.success("User deleted successfully");
			closeModal();
		} catch (error) {
			toast.error("Failed to delete user");
			console.error(error);
		}
	}

	function handleEdit(user: IUser) {
		openModal(<UserForm initialData={user} onSubmit={(data) => handleEditUser(user, data)} />);
	}

	function handleDelete(user: IUser) {
		openModal(
			<ConfirmDelete
				title="Delete user?"
				message={`This will permanently delete ${user.email}'s account. This action cannot be undone.`}
				onConfirm={() => handleDeleteUser(user)}
				onCancel={closeModal}
			/>,
		);
	}

	return (
		<div className="mx-auto max-w-6xl">
			<PageHeader
				icon={<UserCog />}
				title="Users"
				count={users.length}
				action={
					<Button onClick={() => openModal(<UserForm onSubmit={handleAddUser} />)}>
						<Plus className="h-4 w-4" /> Add User
					</Button>
				}
			/>

			{users.length === 0 ? (
				<EmptyState>No users yet. Create user accounts to grant access to the platform.</EmptyState>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{users.map((user) => (
						<div key={user.id} className="min-w-0">
							<UserCard user={user} onEdit={handleEdit} onDelete={handleDelete} canEdit />
						</div>
					))}
				</div>
			)}
		</div>
	);
}
