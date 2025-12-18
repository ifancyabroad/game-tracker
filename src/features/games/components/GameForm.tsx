import { useState } from "react";
import type { IGame, GameType } from "features/games/types";
import { Gamepad2 } from "lucide-react";
import { ColorPicker, Input, Label, Button, FormHeader, Radio } from "common/components";

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

	return (
		<form onSubmit={handleSubmit} className="m-0 flex flex-col gap-4 p-0">
			<FormHeader icon={<Gamepad2 />} title={initialData ? "Edit Game" : "Add Game"} />

			<div>
				<Label required>Name</Label>
				<Input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Game Name"
					required
				/>
			</div>

			<div>
				<Label required>Points</Label>
				<Input
					type="number"
					value={points}
					onChange={(e) => setPoints(Number(e.target.value))}
					placeholder="Game Points"
					min={1}
					max={3}
					required
				/>
			</div>

			<div>
				<Label>Type</Label>
				<div className="flex gap-4">
					<Radio
						label="Board Game"
						value="board"
						checked={type === "board"}
						onChange={(e) => setType(e.target.value as GameType)}
					/>
					<Radio
						label="Video Game"
						value="video"
						checked={type === "video"}
						onChange={(e) => setType(e.target.value as GameType)}
					/>
				</div>
			</div>

			<ColorPicker label="Game colour" value={color} onChange={setColor} showInput />

			<Button type="submit">{initialData ? "Save Changes" : "Add Game"}</Button>
		</form>
	);
};
