import { useState } from "react";
import type { IGame } from "features/games/types";

interface IGameFormProps {
	initialData?: IGame;
	onSubmit: (game: Omit<IGame, "id">) => void;
}

export const GameForm: React.FC<IGameFormProps> = ({ initialData, onSubmit }) => {
	const [name, setName] = useState(initialData?.name || "");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;
		onSubmit({ name: name.trim() });
		if (!initialData) setName(""); // reset form after new add
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<h3 className="text-xl font-bold text-[var(--color-primary)]">{initialData ? "Edit Game" : "Add Game"}</h3>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Game Name"
				className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
				required
			/>
			<button
				type="submit"
				className="w-full rounded-lg bg-[var(--color-primary)] py-2 font-semibold text-[var(--color-primary-contrast)] transition-opacity hover:opacity-90"
			>
				{initialData ? "Save Changes" : "Add Game"}
			</button>
		</form>
	);
};
