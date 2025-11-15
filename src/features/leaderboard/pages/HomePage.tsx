import React from "react";
import { Trophy } from "lucide-react";
import { usePlayerLeaderboard } from "features/leaderboard/utils/hooks";
import { PlayerCard } from "features/leaderboard/components/PlayerCard";

export const HomePage: React.FC = () => {
	const leaderboard = usePlayerLeaderboard();
	const hasData = leaderboard.length > 0;
	const maxPoints = hasData ? leaderboard[0].data.points : 0;

	return (
		<div className="mx-auto max-w-6xl">
			<div className="mb-4 flex items-center gap-2 text-white">
				<Trophy className="h-5 w-5 text-[var(--color-primary)]" />
				<h1 className="text-base font-semibold">Leaderboard</h1>
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
