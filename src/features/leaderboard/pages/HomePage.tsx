import React, { useState } from "react";
import { Trophy, Dices, Gamepad2 } from "lucide-react";
import { usePlayerLeaderboard } from "features/leaderboard/utils/hooks";
import { PlayerCard } from "features/leaderboard/components/PlayerCard";
import type { GameType } from "features/games/types";

export const HomePage: React.FC = () => {
	const [gameType, setGameType] = useState<GameType>("board");
	const leaderboard = usePlayerLeaderboard(gameType);
	const hasData = leaderboard.length > 0;
	const maxPoints = hasData ? leaderboard[0].data.points : 0;

	return (
		<div className="mx-auto max-w-6xl">
			<div className="mb-4 flex items-center justify-between gap-4">
				<div className="flex items-center gap-2 text-white">
					<Trophy className="h-5 w-5 text-[var(--color-primary)]" />
					<h1 className="text-base font-semibold">Leaderboard</h1>
				</div>

				<div className="flex gap-2 rounded-lg border border-gray-700 bg-black/20 p-1">
					<button
						onClick={() => setGameType("board")}
						className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
							gameType === "board"
								? "bg-[var(--color-primary)] text-[var(--color-primary-contrast)]"
								: "text-gray-400 hover:text-gray-200"
						}`}
					>
						<Dices className="h-4 w-4" />
						Board
					</button>
					<button
						onClick={() => setGameType("video")}
						className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
							gameType === "video"
								? "bg-[var(--color-primary)] text-[var(--color-primary-contrast)]"
								: "text-gray-400 hover:text-gray-200"
						}`}
					>
						<Gamepad2 className="h-4 w-4" />
						Video
					</button>
				</div>
			</div>

			<div className="mt-3 space-y-2">
				{!hasData ? (
					<div className="rounded-xl border border-dashed border-gray-700 bg-[var(--color-surface)] p-8 text-center text-sm text-gray-400">
						No results yet. Play some games to populate the board!
					</div>
				) : (
					leaderboard.map((row, idx) => (
						<PlayerCard key={row.id} row={row} rank={idx + 1} maxPoints={maxPoints} />
					))
				)}
			</div>
		</div>
	);
};

export default HomePage;
