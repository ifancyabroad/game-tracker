import { Gamepad2, Dices } from "lucide-react";
import type { GameType } from "features/games/types";

interface IGameTypeIconProps {
	type: GameType;
	className?: string;
}

export const GameTypeIcon: React.FC<IGameTypeIconProps> = ({ type, className = "h-5 w-5" }) => {
	if (type === "video") {
		return <Gamepad2 className={className} />;
	}
	return <Dices className={className} />;
};
