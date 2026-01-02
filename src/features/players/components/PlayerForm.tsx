import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IPlayer } from "features/players/types";
import { User } from "lucide-react";
import { usePlayers } from "features/players/context/PlayersContext";
import { ColorPicker, Input, Label, Button, FormHeader, ErrorMessage, Switch } from "common/components";
import { playerSchema, type PlayerFormData } from "common/utils/validation";

interface IPlayerFormProps {
	onSubmit: (player: Omit<IPlayer, "id">) => Promise<void> | void;
	initialData?: IPlayer;
	hideHeader?: boolean;
}

export const PlayerForm: React.FC<IPlayerFormProps> = ({ onSubmit, initialData, hideHeader = false }) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.pictureUrl || null);
	const { uploadImage } = usePlayers();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<PlayerFormData>({
		resolver: zodResolver(playerSchema),
		defaultValues: {
			firstName: initialData?.firstName || "",
			lastName: initialData?.lastName || "",
			preferredName: initialData?.preferredName || "",
			color: initialData?.color || "#6366f1",
			pictureUrl: initialData?.pictureUrl || "",
			showOnLeaderboard: initialData?.showOnLeaderboard ?? true,
		},
	});

	const colorValue = watch("color");
	const pictureUrlValue = watch("pictureUrl");
	const showOnLeaderboardValue = watch("showOnLeaderboard");

	const handleImageUpload = async (file: File) => {
		const url = await uploadImage(file);
		setValue("pictureUrl", url);
		setPreviewUrl(url);
	};

	const onFormSubmit = (data: PlayerFormData) => {
		onSubmit({
			...data,
			preferredName: data.preferredName?.trim() || null,
			pictureUrl: data.pictureUrl?.trim() || null,
			linkedUserId: initialData?.linkedUserId || null,
		});
		if (!initialData) {
			reset();
			setPreviewUrl(null);
		}
	};

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className="m-0 flex flex-col gap-4 p-0">
			{!hideHeader && <FormHeader icon={<User />} title={initialData ? "Edit Player" : "Add Player"} />}

			<div className="grid gap-3 sm:grid-cols-2">
				<div>
					<Label required>First Name</Label>
					<Input type="text" {...register("firstName")} placeholder="First Name" />
					{errors.firstName && <ErrorMessage>{errors.firstName.message}</ErrorMessage>}
				</div>
				<div>
					<Label required>Last Name</Label>
					<Input type="text" {...register("lastName")} placeholder="Last Name" />
					{errors.lastName && <ErrorMessage>{errors.lastName.message}</ErrorMessage>}
				</div>
			</div>

			<div>
				<Label>Preferred Name (optional)</Label>
				<Input type="text" {...register("preferredName")} placeholder="Preferred Name" />
				{errors.preferredName && <ErrorMessage>{errors.preferredName.message}</ErrorMessage>}
			</div>

			<div>
				<ColorPicker
					label="Favourite colour"
					value={colorValue}
					onChange={(newColor) => setValue("color", newColor)}
					showInput
				/>
				{errors.color && <ErrorMessage>{errors.color.message}</ErrorMessage>}
			</div>

			<div>
				<label className="mb-1 block text-xs text-[var(--color-text-secondary)]">Picture</label>
				<div className="flex items-center gap-3">
					<div className="h-12 w-12 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-accent)]">
						{previewUrl || pictureUrlValue ? (
							<img
								src={previewUrl || pictureUrlValue || ""}
								className="h-full w-full object-cover"
								alt="Player preview"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center text-xs text-[var(--color-text-muted)]">
								No image
							</div>
						)}
					</div>
					<label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)] px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-primary)]/10">
						Upload
						<input
							type="file"
							accept="image/*"
							className="hidden"
							onChange={async (e) => e.target.files && (await handleImageUpload(e.target.files[0]))}
						/>
					</label>
				</div>
			</div>

			<div>
				<Switch
					checked={showOnLeaderboardValue}
					onChange={(checked) => setValue("showOnLeaderboard", checked)}
					label="Show on Leaderboard"
					description="Include this player in the public leaderboard"
				/>
			</div>

			<Button type="submit">{initialData ? "Save Changes" : "Add Player"}</Button>
		</form>
	);
};
