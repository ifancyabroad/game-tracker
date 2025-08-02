import { useState } from "react";
import type { IPlayer } from "features/players/types";
import { uploadPlayerImage } from "features/players/api";

interface PlayerFormProps {
	initial?: Omit<IPlayer, "id">;
	onSubmit: (data: Omit<IPlayer, "id">) => void;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ initial, onSubmit }) => {
	const [firstName, setFirstName] = useState(initial?.firstName || "");
	const [lastName, setLastName] = useState(initial?.lastName || "");
	const [preferredName, setPreferredName] = useState(initial?.preferredName || "");
	const [picture, setPicture] = useState<File | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		let pictureUrl = initial?.pictureUrl;

		if (picture) {
			pictureUrl = await uploadPlayerImage(picture);
		}

		onSubmit({ firstName, lastName, preferredName, pictureUrl });
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow">
			<input
				type="text"
				placeholder="First Name"
				value={firstName}
				onChange={(e) => setFirstName(e.target.value)}
				className="rounded border p-2"
				required
			/>
			<input
				type="text"
				placeholder="Last Name"
				value={lastName}
				onChange={(e) => setLastName(e.target.value)}
				className="rounded border p-2"
				required
			/>
			<input
				type="text"
				placeholder="Preferred Name"
				value={preferredName}
				onChange={(e) => setPreferredName(e.target.value)}
				className="rounded border p-2"
				required
			/>
			<input type="file" accept="image/*" onChange={(e) => setPicture(e.target.files?.[0] || null)} />
			<button type="submit" className="bg-primary hover:bg-primary/80 rounded py-2 text-white">
				Save Player
			</button>
		</form>
	);
};
