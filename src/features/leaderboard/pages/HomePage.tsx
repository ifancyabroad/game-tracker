import React, { useState } from "react";
import { Trophy } from "lucide-react";
import { usePlayerLeaderboard } from "features/leaderboard/utils/hooks";
import { PlayerCard } from "features/leaderboard/components/PlayerCard";
import { GameTypeToggle, PageHeader } from "common/components";
import type { GameType } from "features/games/types";

export const HomePage: React.FC = () => {
	const [gameType, setGameType] = useState<GameType>("board");
	const leaderboard = usePlayerLeaderboard(gameType);
	const hasData = leaderboard.length > 0;
	const maxPoints = hasData ? leaderboard[0].data.points : 0;

	return (
		<div className="mx-auto max-w-6xl">
			<PageHeader
				icon={<Trophy />}
				title="Leaderboard"
				action={<GameTypeToggle value={gameType} onChange={setGameType} />}
			/>

			<div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
				{!hasData ? (
					<div className="rounded-xl border border-dashed border-gray-700 bg-[var(--color-surface)] p-6 text-center text-sm text-gray-400 sm:p-8">
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
