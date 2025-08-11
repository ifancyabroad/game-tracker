import { useEffect, useState } from "react";
import type { IPlayer } from "features/players/types";
import { User } from "lucide-react";
import { usePlayers } from "features/players/context/PlayersContext";

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
	const [errors, setErrors] = useState<{ firstName?: string; lastName?: string } | null>(null);
	const { uploadImage } = usePlayers();

	useEffect(() => {
		if (pictureUrl) setPreviewUrl(pictureUrl);
	}, [pictureUrl]);

	const inputCls =
		"w-full rounded-lg border border-gray-700 bg-black/20 px-3 py-2 text-sm text-[var(--color-text)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent";

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
		});
	};

	return (
		<form onSubmit={handleSubmit} className="m-0 flex flex-col gap-4 p-0">
			<div className="flex items-center gap-2 text-gray-300">
				<User className="h-4 w-4 text-[var(--color-primary)]" />
				<h3 className="text-sm font-semibold text-white">{initialData ? "Edit Player" : "Add Player"}</h3>
			</div>

			<div className="grid gap-3 sm:grid-cols-2">
				<div>
					<label className="mb-1 block text-xs text-gray-400">First Name</label>
					<input
						type="text"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						className={`${inputCls} ${errors?.firstName ? "ring-2 ring-red-500" : ""}`}
					/>
					{errors?.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>}
				</div>
				<div>
					<label className="mb-1 block text-xs text-gray-400">Last Name</label>
					<input
						type="text"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						className={`${inputCls} ${errors?.lastName ? "ring-2 ring-red-500" : ""}`}
					/>
					{errors?.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>}
				</div>
			</div>

			<div>
				<label className="mb-1 block text-xs text-gray-400">Preferred Name (optional)</label>
				<input
					type="text"
					value={preferredName}
					onChange={(e) => setPreferredName(e.target.value)}
					className={inputCls}
				/>
			</div>

			<div>
				<label className="mb-1 block text-xs text-gray-400">Picture</label>
				<div className="flex items-center gap-3">
					<div className="h-12 w-12 overflow-hidden rounded-full border border-gray-700 bg-black/20">
						{previewUrl ? (
							<img src={previewUrl} className="h-full w-full object-cover" alt="Player preview" />
						) : (
							<div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
								No image
							</div>
						)}
					</div>
					<label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-700 bg-black/20 px-3 py-2 text-sm text-gray-200 hover:bg-[var(--color-primary)]/10">
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

			<button
				type="submit"
				className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-contrast)] transition-opacity hover:opacity-90"
			>
				{initialData ? "Save Changes" : "Add Player"}
			</button>
		</form>
	);
};
