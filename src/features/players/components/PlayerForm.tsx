import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IPlayer } from "features/players/types";
import { User, Upload as UploadIcon } from "lucide-react";
import { usePlayers } from "features/players/context/PlayersContext";
import { ColorPicker, Input, Label, Button, FormHeader, ErrorMessage, Switch } from "common/components";
import { ImageCropper } from "common/components/ImageCropper";
import { playerSchema, type PlayerFormData } from "common/utils/validation";
import { useToast } from "common/utils/hooks";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface IPlayerFormProps {
	onSubmit: (player: Omit<IPlayer, "id">) => Promise<void> | void;
	initialData?: IPlayer;
	hideHeader?: boolean;
}

export const PlayerForm: React.FC<IPlayerFormProps> = ({ onSubmit, initialData, hideHeader = false }) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.pictureUrl || null);
	const [cropperImage, setCropperImage] = useState<string | null>(null);
	const [uploadProgress, setUploadProgress] = useState<number | null>(null);
	const { uploadImage } = usePlayers();
	const toast = useToast();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors, isDirty, isSubmitting },
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

	const handleFileSelect = (file: File) => {
		// Validate file size
		if (file.size > MAX_FILE_SIZE) {
			toast.error(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
			return;
		}

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}

		// Create preview URL for cropper
		const reader = new FileReader();
		reader.onload = () => {
			setCropperImage(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleCropComplete = async (croppedBlob: Blob) => {
		try {
			setUploadProgress(0);
			setCropperImage(null);

			const url = await uploadImage(croppedBlob, (progress) => {
				setUploadProgress(progress);
			});

			setValue("pictureUrl", url, { shouldDirty: true });
			setPreviewUrl(url);
			setUploadProgress(null);
			toast.success("Image uploaded successfully");
		} catch (error) {
			console.error("Upload failed:", error);
			toast.error("Failed to upload image");
			setUploadProgress(null);
		}
	};

	const handleCropCancel = () => {
		setCropperImage(null);
	};

	const onFormSubmit = async (data: PlayerFormData) => {
		await Promise.resolve(
			onSubmit({
				...data,
				preferredName: data.preferredName?.trim() || null,
				pictureUrl: data.pictureUrl?.trim() || null,
				linkedUserId: initialData?.linkedUserId || null,
			}),
		);
		if (!initialData) {
			reset();
			setPreviewUrl(null);
		} else {
			// Reset form with new values to clear dirty state
			reset(data);
		}
	};

	const isEditMode = !!initialData;
	const isSubmitDisabled = isSubmitting || (isEditMode && !isDirty);

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className="m-0 flex flex-col gap-4 p-0">
			{!hideHeader && <FormHeader icon={<User />} title={initialData ? "Edit Player" : "Add Player"} />}

			<div className="grid gap-3 sm:grid-cols-2">
				<div>
					<Label required>First Name</Label>
					<Input type="text" {...register("firstName")} placeholder="First Name" maxLength={30} />
					{errors.firstName && <ErrorMessage>{errors.firstName.message}</ErrorMessage>}
				</div>
				<div>
					<Label required>Last Name</Label>
					<Input type="text" {...register("lastName")} placeholder="Last Name" maxLength={30} />
					{errors.lastName && <ErrorMessage>{errors.lastName.message}</ErrorMessage>}
				</div>
			</div>

			<div>
				<Label>Preferred Name (optional)</Label>
				<Input type="text" {...register("preferredName")} placeholder="Preferred Name" maxLength={30} />
				{errors.preferredName && <ErrorMessage>{errors.preferredName.message}</ErrorMessage>}
			</div>

			<div>
				<ColorPicker
					label="Favourite colour"
					value={colorValue}
					onChange={(newColor) => setValue("color", newColor, { shouldDirty: true })}
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
					<div className="flex-1">
						<label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)] px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-primary)]/10">
							<UploadIcon className="h-4 w-4" />
							{uploadProgress !== null ? `Uploading ${Math.round(uploadProgress)}%` : "Upload Image"}
							<input
								type="file"
								accept="image/*"
								className="hidden"
								disabled={uploadProgress !== null}
								onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
							/>
						</label>
						<p className="mt-1 text-xs text-[var(--color-text-muted)]">
							Max {MAX_FILE_SIZE / 1024 / 1024}MB • Square images work best
						</p>
					</div>
				</div>
			</div>

			<div>
				<Switch
					checked={showOnLeaderboardValue}
					onChange={(checked) => setValue("showOnLeaderboard", checked, { shouldDirty: true })}
					label="Show on Leaderboard"
					description="Include this player in the public leaderboard"
				/>
			</div>

			<Button type="submit" disabled={isSubmitDisabled}>
				{isEditMode ? "Save Changes" : "Add Player"}
			</Button>

			{cropperImage && (
				<ImageCropper imageSrc={cropperImage} onCropComplete={handleCropComplete} onCancel={handleCropCancel} />
			)}
		</form>
	);
};
