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
		formState: { errors, isSubmitting },
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

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<FormHeader icon={<UserCog />} title={isEdit ? "Edit User" : "Add User"} />
			{!isEdit && (
				<p className="text-sm text-gray-500">
					Create a new user account. A temporary password will be generated.
				</p>
			)}

			<div className="space-y-4">
				<div>
					<Label htmlFor="email">Email</Label>
					<Input id="email" type="email" disabled={isEdit} {...register("email")} />
					{errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
					{isEdit && <p className="mt-1 text-sm text-gray-500">Email cannot be changed after creation</p>}
				</div>

				<div>
					<Label htmlFor="role">Role</Label>
					<Select id="role" {...register("role")}>
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</Select>
					{errors.role && <ErrorMessage>{errors.role.message}</ErrorMessage>}
					<p className="mt-1 text-sm text-gray-500">
						Admins can manage all data. Users can only edit their own profile.
					</p>
				</div>

				<div>
					<Label htmlFor="linkedPlayerId">Link to Player (Optional)</Label>
					<Select id="linkedPlayerId" {...register("linkedPlayerId")}>
						<option value="">Not linked</option>
						{availablePlayers.map((player: IPlayer) => (
							<option key={player.id} value={player.id}>
								{getDisplayName(player)}
							</option>
						))}
					</Select>
					{errors.linkedPlayerId && <ErrorMessage>{errors.linkedPlayerId.message}</ErrorMessage>}
					<p className="mt-1 text-sm text-gray-500">
						Link this user to a player profile for stats and personalization.
					</p>
				</div>
			</div>

			<div className="flex gap-3">
				<Button type="submit" disabled={isSubmitting} className="flex-1">
					{isSubmitting ? "Saving..." : isEdit ? "Update User" : "Create User"}
				</Button>
			</div>
		</form>
	);
}
