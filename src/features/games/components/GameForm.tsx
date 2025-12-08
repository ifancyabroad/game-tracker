import { useState } from "react";
import type { IGame, GameType } from "features/games/types";
import { Gamepad2 } from "lucide-react";
import ColorPicker from "common/components/ColorPicker";

interface IGameFormProps {
	initialData?: IGame;
	onSubmit: (game: Omit<IGame, "id">) => void;
}

export const GameForm: React.FC<IGameFormProps> = ({ initialData, onSubmit }) => {
	const [name, setName] = useState(initialData?.name || "");
	const [points, setPoints] = useState(initialData?.points || 1);
	const [type, setType] = useState<GameType>(initialData?.type || "board");
	const [color, setColor] = useState<string>(initialData?.color || "#6366f1");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;
		onSubmit({ name: name.trim(), points, type, color });
		if (!initialData) {
			setName("");
			setPoints(1);
			setType("board");
			setColor("#6366f1");
		}
	};

	const inputCls =
		"w-full rounded-lg border border-gray-700 bg-black/20 px-3 py-2 text-sm text-[var(--color-text)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent";

	return (
		<form onSubmit={handleSubmit} className="m-0 flex flex-col gap-4 p-0">
			<div className="flex items-center gap-2 text-gray-300">
				<Gamepad2 className="h-4 w-4 text-[var(--color-primary)]" />
				<h3 className="text-sm font-semibold text-white">{initialData ? "Edit Game" : "Add Game"}</h3>
			</div>

			<div>
				<label className="mb-1 block text-xs text-gray-400">Name</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Game Name"
					className={inputCls}
					required
				/>
			</div>

			<div>
				<label className="mb-1 block text-xs text-gray-400">Points</label>
				<input
					type="number"
					value={points}
					onChange={(e) => setPoints(Number(e.target.value))}
					placeholder="Game Points"
					className={inputCls}
					min={1}
					max={3}
					required
				/>
			</div>

			<div>
				<label className="mb-1 block text-xs text-gray-400">Type</label>
				<div className="flex gap-4">
					<label className="group flex cursor-pointer items-center gap-2 text-sm text-gray-300">
						<div className="relative flex h-4 w-4 items-center justify-center">
							<input
								type="radio"
								value="board"
								checked={type === "board"}
								onChange={(e) => setType(e.target.value as GameType)}
								className="peer sr-only"
							/>
							<div className="h-4 w-4 rounded-full border-2 border-gray-600 bg-black/20 transition-all group-hover:border-gray-500 peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]/20"></div>
							<div className="absolute h-2 w-2 rounded-full bg-[var(--color-primary)] opacity-0 transition-opacity peer-checked:opacity-100"></div>
						</div>
						Board Game
					</label>
					<label className="group flex cursor-pointer items-center gap-2 text-sm text-gray-300">
						<div className="relative flex h-4 w-4 items-center justify-center">
							<input
								type="radio"
								value="video"
								checked={type === "video"}
								onChange={(e) => setType(e.target.value as GameType)}
								className="peer sr-only"
							/>
							<div className="h-4 w-4 rounded-full border-2 border-gray-600 bg-black/20 transition-all group-hover:border-gray-500 peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]/20"></div>
							<div className="absolute h-2 w-2 rounded-full bg-[var(--color-primary)] opacity-0 transition-opacity peer-checked:opacity-100"></div>
						</div>
						Video Game
					</label>
				</div>
			</div>

			<ColorPicker label="Game colour" value={color} onChange={setColor} showInput />

			<button
				type="submit"
				className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-contrast)] transition-opacity hover:opacity-90"
			>
				{initialData ? "Save Changes" : "Add Game"}
			</button>
		</form>
	);
};
