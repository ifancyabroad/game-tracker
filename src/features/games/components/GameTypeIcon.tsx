import { Gamepad2, Dices } from "lucide-react";
import type { GameType } from "features/games/types";

interface IGameTypeIconProps {
	type: GameType;
	className?: string;
	style?: React.CSSProperties;
}

export const GameTypeIcon: React.FC<IGameTypeIconProps> = ({ type, className = "h-5 w-5", style }) => {
	if (type === "video") {
		return <Gamepad2 className={className} style={style} />;
	}
	return <Dices className={className} style={style} />;
};
