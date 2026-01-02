import { Navigate } from "react-router";
import { LogOut, User as UserIcon } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "firebase";
import { useAuth } from "common/context/AuthContext";
import { usePlayers } from "features/players/context/PlayersContext";
import { PlayerForm } from "features/players/components/PlayerForm";
import { PageHeader, Card, Button, EmptyState } from "common/components";
import { useToast } from "common/utils/hooks";
import { useModal } from "common/context/ModalContext";
import type { IPlayer } from "features/players/types";

export const ProfilePage: React.FC = () => {
	const { authUser, user } = useAuth();
	const { playerById, editPlayer } = usePlayers();
	const toast = useToast();
	const { closeModal } = useModal();

	// Redirect unauthenticated users to home
	if (!authUser) {
		return <Navigate to="/" replace />;
	}

	const linkedPlayer = user?.linkedPlayerId ? playerById.get(user.linkedPlayerId) : null;

	const handleUpdateProfile = async (playerData: Omit<IPlayer, "id">) => {
		if (!linkedPlayer) return;

		try {
			await editPlayer(linkedPlayer.id, playerData);
			toast.success("Profile updated successfully");
			closeModal();
		} catch (error) {
			console.error("Profile update error:", error);
			toast.error("Failed to update profile");
		}
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
			toast.success("Logged out successfully");
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Failed to log out");
		}
	};

	return (
		<div className="mx-auto max-w-6xl">
			<PageHeader icon={<UserIcon />} title="My Profile" />

			<div className="mt-6 grid gap-4 md:grid-cols-3 md:items-start">
				{/* Player Profile Card - Takes 2 columns on desktop */}
				{linkedPlayer ? (
					<Card className="p-4 sm:p-6 md:col-span-2">
						<h2 className="mb-4 text-lg font-semibold">Player Profile</h2>
						<PlayerForm onSubmit={handleUpdateProfile} initialData={linkedPlayer} hideHeader />
					</Card>
				) : (
					<div className="flex items-center md:col-span-2">
						<EmptyState>
							Your account is not linked to a player profile. Contact an administrator to link your
							account.
						</EmptyState>
					</div>
				)}

				{/* Account Info Card - Takes 1 column on desktop */}
				<Card className="p-4 sm:p-6">
					<h2 className="mb-4 text-lg font-semibold">Account Information</h2>
					<div className="space-y-3 text-sm">
						<div className="flex flex-col gap-1">
							<span className="text-[var(--color-text-secondary)]">Email</span>
							<span className="font-medium">{user?.email}</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-[var(--color-text-secondary)]">Role</span>
							<span className="font-medium capitalize">{user?.role}</span>
						</div>
					</div>

					<div className="mt-6 border-t border-[var(--color-border)] pt-4">
						<Button onClick={handleLogout} variant="secondary" size="md" className="w-full">
							<LogOut size={16} />
							Logout
						</Button>
					</div>
				</Card>
			</div>
		</div>
	);
};
