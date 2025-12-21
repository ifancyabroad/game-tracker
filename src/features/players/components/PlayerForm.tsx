import { useEffect, useState } from "react";
import type { IPlayer } from "features/players/types";
import { User } from "lucide-react";
import { usePlayers } from "features/players/context/PlayersContext";
import { ColorPicker, Input, Label, Button, FormHeader, ErrorMessage } from "common/components";

interface IPlayerFormProps {
	onSubmit: (player: Omit<IPlayer, "id">) => Promise<void> | void;
	initialData?: IPlayer;
}

export const PlayerForm: React.FC<IPlayerFormProps> = ({ onSubmit, initialData }) => {
	const [firstName, setFirstName] = useState(initialData?.firstName || "");
	const [lastName, setLastName] = useState(initialData?.lastName || "");
	const [preferredName, setPreferredName] = useState(initialData?.preferredName || "");
	const [pictureUrl, setPictureUrl] = useState(initialData?.pictureUrl || "");
	const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.pictureUrl || null);
	const [color, setColor] = useState<string>(initialData?.color || "#6366f1");
	const [errors, setErrors] = useState<{ firstName?: string; lastName?: string } | null>(null);
	const { uploadImage } = usePlayers();

	useEffect(() => {
		if (pictureUrl) setPreviewUrl(pictureUrl);
	}, [pictureUrl]);

	const handleImageUpload = async (file: File) => {
		const url = await uploadImage(file);
		setPictureUrl(url);
		setPreviewUrl(url);
	};

	const validate = () => {
		const errs: { firstName?: string; lastName?: string } = {};
		if (!firstName.trim()) errs.firstName = "First name is required";
		if (!lastName.trim()) errs.lastName = "Last name is required";
		setErrors(Object.keys(errs).length ? errs : null);
		return Object.keys(errs).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		await onSubmit({
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			preferredName: preferredName.trim() || null,
			pictureUrl: pictureUrl || null,
			color,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="m-0 flex flex-col gap-4 p-0">
			<FormHeader icon={<User />} title={initialData ? "Edit Player" : "Add Player"} />

			<div className="grid gap-3 sm:grid-cols-2">
				<div>
					<Label required>First Name</Label>
					<Input
						type="text"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						error={!!errors?.firstName}
					/>
					<ErrorMessage>{errors?.firstName}</ErrorMessage>
				</div>
				<div>
					<Label required>Last Name</Label>
					<Input
						type="text"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						error={!!errors?.lastName}
					/>
					<ErrorMessage>{errors?.lastName}</ErrorMessage>
				</div>
			</div>

			<div>
				<Label>Preferred Name (optional)</Label>
				<Input type="text" value={preferredName} onChange={(e) => setPreferredName(e.target.value)} />
			</div>

			<ColorPicker label="Favourite colour" value={color} onChange={setColor} showInput />

			<div>
				<label className="mb-1 block text-xs text-[var(--color-text-secondary)]">Picture</label>
				<div className="flex items-center gap-3">
					<div className="h-12 w-12 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-accent)]">
						{previewUrl ? (
							<img src={previewUrl} className="h-full w-full object-cover" alt="Player preview" />
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

			<Button type="submit">{initialData ? "Save Changes" : "Add Player"}</Button>
		</form>
	);
};
