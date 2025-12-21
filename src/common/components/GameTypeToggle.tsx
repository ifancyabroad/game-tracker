import { Dices, Gamepad2 } from "lucide-react";
import type { GameType } from "features/games/types";

interface GameTypeToggleProps {
	value: GameType;
	onChange: (value: GameType) => void;
}

export const GameTypeToggle: React.FC<GameTypeToggleProps> = ({ value, onChange }) => {
	return (
		<div className="flex gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)] p-1">
			<button
				onClick={() => onChange("board")}
				className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
					value === "board"
						? "bg-[var(--color-primary)] text-[var(--color-primary-contrast)]"
						: "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
				}`}
			>
				<Dices className="h-4 w-4" />
				Board
			</button>
			<button
				onClick={() => onChange("video")}
				className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
					value === "video"
						? "bg-[var(--color-primary)] text-[var(--color-primary-contrast)]"
						: "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
				}`}
			>
				<Gamepad2 className="h-4 w-4" />
				Video
			</button>
		</div>
	);
};
