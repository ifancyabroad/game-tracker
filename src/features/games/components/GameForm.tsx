import { useState } from "react";
import type { IGame } from "features/games/types";
import { Gamepad2 } from "lucide-react";

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
		if (!initialData) setName("");
	};

	const inputCls =
		"w-full rounded-lg border border-gray-700 bg-black/20 px-3 py-2 text-sm text-[var(--color-text)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent";

	return (
		<form onSubmit={handleSubmit} className="m-0 flex flex-col gap-4 p-0">
			<div className="flex items-center gap-2 text-gray-300">
				<Gamepad2 className="h-4 w-4 text-[var(--color-primary)]" />
				<h3 className="text-sm font-semibold text-white">{initialData ? "Edit Game" : "Add Game"}</h3>
			</div>

			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Game Name"
				className={inputCls}
				required
			/>

			<button
				type="submit"
				className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-contrast)] transition-opacity hover:opacity-90"
			>
				{initialData ? "Save Changes" : "Add Game"}
			</button>
		</form>
	);
};
