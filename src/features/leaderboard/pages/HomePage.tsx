import React, { useState } from "react";
import { Trophy, Dices, Gamepad2 } from "lucide-react";
import { usePlayerLeaderboard, usePlayerChampionships } from "features/leaderboard/utils/hooks";
import { PlayerCard } from "features/leaderboard/components/PlayerCard";
import { SegmentedControl, PageHeader } from "common/components";
import type { SegmentedControlOption } from "common/components/SegmentedControl";
import type { GameType } from "features/games/types";

const gameTypeOptions: SegmentedControlOption<GameType>[] = [
	{ value: "board", label: "Board", icon: Dices },
	{ value: "video", label: "Video", icon: Gamepad2 },
];

export const HomePage: React.FC = () => {
	const [gameType, setGameType] = useState<GameType>("board");
	const leaderboard = usePlayerLeaderboard(gameType);
	const championships = usePlayerChampionships(gameType);
	const hasData = leaderboard.length > 0;
	const maxPoints = hasData ? leaderboard[0].data.points : 0;

	return (
		<div className="mx-auto max-w-6xl">
			<PageHeader
				icon={<Trophy />}
				title="Leaderboard"
				action={<SegmentedControl value={gameType} onChange={setGameType} options={gameTypeOptions} />}
			/>

			<div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
				{!hasData ? (
					<div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center text-sm text-[var(--color-text-secondary)] sm:p-8">
						No results yet. Play some games to populate the board!
					</div>
				) : (
					leaderboard.map((row, idx) => (
						<PlayerCard
							key={row.id}
							row={row}
							rank={idx + 1}
							maxPoints={maxPoints}
							championshipYears={championships.get(row.id) || []}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default HomePage;
