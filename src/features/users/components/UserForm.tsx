import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "common/components";
import { Input } from "common/components";
import { Label } from "common/components";
import { Select } from "common/components";
import { FormHeader } from "common/components";
import { ErrorMessage } from "common/components";
import { UserCog } from "lucide-react";
import type { IUser } from "features/users/types";
import { usePlayers } from "features/players/context/PlayersContext";
import { getDisplayName } from "features/players/utils/helpers";
import type { IPlayer } from "features/players/types";
import { userSchema, type UserFormData } from "common/utils/validation";

interface UserFormProps {
	initialData?: IUser;
	onSubmit: (data: UserFormData) => void | Promise<void>;
}

export function UserForm({ initialData, onSubmit }: UserFormProps) {
	const { players } = usePlayers();
	const isEdit = !!initialData;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<UserFormData>({
		resolver: zodResolver(userSchema),
		defaultValues: initialData
			? {
					email: initialData.email,
					role: initialData.role,
					linkedPlayerId: initialData.linkedPlayerId,
				}
			: {
					email: "",
					role: "user",
					linkedPlayerId: null,
				},
	});

	// Filter out players that are already linked to other users
	const availablePlayers = players.filter((p: IPlayer) => !p.linkedUserId || p.linkedUserId === initialData?.id);

	const onFormSubmit = async (data: UserFormData) => {
		await onSubmit(data);
		if (!isEdit) {
			reset();
		} else {
			// Reset form with new values to clear dirty state
			reset(data);
		}
	};

	const isSubmitDisabled = isSubmitting || (isEdit && !isDirty);

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className="m-0 flex flex-col gap-4 p-0">
			<FormHeader icon={<UserCog />} title={isEdit ? "Edit User" : "Add User"} />

			{!isEdit && (
				<p className="text-sm text-[var(--color-text-secondary)]">
					Create a new user account. A temporary password will be generated and sent via email.
				</p>
			)}

			<div>
				<Label htmlFor="email" required>
					Email
				</Label>
				<Input id="email" type="email" disabled={isEdit} error={!!errors.email} {...register("email")} />
				{errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
				{isEdit && (
					<p className="mt-1 text-xs text-[var(--color-text-muted)]">
						Email cannot be changed after creation
					</p>
				)}
			</div>

			<div>
				<Label htmlFor="role" required>
					Role
				</Label>
				<Select id="role" {...register("role")}>
					<option value="user">User</option>
					<option value="admin">Admin</option>
				</Select>
				{errors.role && <ErrorMessage>{errors.role.message}</ErrorMessage>}
				<p className="mt-1 text-xs text-[var(--color-text-muted)]">
					Admins can manage all data. Users can only edit their own profile.
				</p>
			</div>

			<div>
				<Label htmlFor="linkedPlayerId">Link to Player</Label>
				<Select id="linkedPlayerId" {...register("linkedPlayerId")}>
					<option value="">Not linked</option>
					{availablePlayers.map((player: IPlayer) => (
						<option key={player.id} value={player.id}>
							{getDisplayName(player)}
						</option>
					))}
				</Select>
				{errors.linkedPlayerId && <ErrorMessage>{errors.linkedPlayerId.message}</ErrorMessage>}
				<p className="mt-1 text-xs text-[var(--color-text-muted)]">
					Link this user to a player profile for stats and personalization
				</p>
			</div>

			<Button type="submit" disabled={isSubmitDisabled}>
				{isSubmitting ? "Saving..." : isEdit ? "Update User" : "Create User"}
			</Button>
		</form>
	);
}
