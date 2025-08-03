import { useEffect, useState } from "react";
import type { IPlayer } from "features/players/types";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "firebase";

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
	const [file, setFile] = useState<File | null>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	useEffect(() => {
		return () => {
			if (previewUrl?.startsWith("blob:")) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	const validate = () => {
		const newErrors: typeof errors = {};
		if (!firstName.trim()) newErrors.firstName = "First name is required";
		if (!lastName.trim()) newErrors.lastName = "Last name is required";
		if (pictureUrl && !pictureUrl.startsWith("http")) newErrors.pictureUrl = "Must be a valid URL";
		return newErrors;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setUploadError(null);

		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setLoading(true);

		try {
			let imageUrl = pictureUrl;

			// Upload file to Firebase Storage if present
			if (file) {
				const fileRef = ref(storage, `player-pictures/${Date.now()}-${file.name}`);
				await uploadBytes(fileRef, file);
				imageUrl = await getDownloadURL(fileRef);
			}

			// Call parent onSubmit with full player data
			await onSubmit({
				firstName,
				lastName,
				preferredName,
				pictureUrl: imageUrl || undefined,
			});
		} catch (error) {
			console.error("Error submitting form:", error);
			setUploadError("Something went wrong during upload or submission.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="m-0 flex flex-col gap-4 p-0">
			<h3 className="text-xl font-bold text-[var(--color-primary)]">
				{initialData ? "Edit Player" : "Add Player"}
			</h3>

			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="w-full">
					<input
						type="text"
						placeholder="First Name"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						className={`w-full rounded border bg-gray-800 p-2 ${
							errors.firstName ? "border-red-500" : "border-gray-700"
						} text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none`}
						required
					/>
					{errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
				</div>

				<div className="w-full">
					<input
						type="text"
						placeholder="Last Name"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						className={`w-full rounded border bg-gray-800 p-2 ${
							errors.lastName ? "border-red-500" : "border-gray-700"
						} text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none`}
						required
					/>
					{errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
				</div>
			</div>

			<input
				type="text"
				placeholder="Preferred Name (optional)"
				value={preferredName}
				onChange={(e) => setPreferredName(e.target.value)}
				className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
			/>

			<div className="w-full">
				<input
					type="file"
					accept="image/*"
					onChange={(e) => {
						const selected = e.target.files?.[0];
						if (selected) {
							setFile(selected);
							setPictureUrl(""); // clear manual URL if switching
							setPreviewUrl(URL.createObjectURL(selected)); // ✅ show preview
						}
					}}
					className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
				/>
				{uploadError && <p className="mt-1 text-sm text-red-400">{uploadError}</p>}
			</div>

			{previewUrl && (
				<div className="flex w-full justify-center">
					<img
						src={previewUrl}
						alt="Preview"
						className="max-h-40 rounded-lg border border-gray-700 object-cover"
					/>
				</div>
			)}

			<button
				type="submit"
				disabled={loading}
				className="w-full rounded-lg bg-[var(--color-primary)] py-2 font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
			>
				{loading ? (initialData ? "Saving..." : "Adding...") : initialData ? "Save Changes" : "Add Player"}
			</button>
		</form>
	);
};
