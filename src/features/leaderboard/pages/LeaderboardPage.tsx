import React, { useState } from "react";
import { Trophy, Dices, Gamepad2, LayoutGrid, List } from "lucide-react";
import { usePlayerLeaderboard, usePlayerChampionships } from "features/leaderboard/utils/hooks";
import { PlayerCard } from "features/leaderboard/components/PlayerCard";
import { LeaderboardTable } from "features/leaderboard/components/LeaderboardTable";
import { SegmentedControl, PageHeader } from "common/components";
import type { SegmentedControlOption } from "common/components/SegmentedControl";
import type { GameType } from "features/games/types";

type ViewMode = "card" | "table";

const gameTypeOptions: SegmentedControlOption<GameType>[] = [
	{ value: "board", label: "Board", icon: Dices },
	{ value: "video", label: "Video", icon: Gamepad2 },
];

const viewModeOptions: SegmentedControlOption<ViewMode>[] = [
	{ value: "card", label: "Cards", icon: LayoutGrid },
	{ value: "table", label: "Table", icon: List },
];

export const LeaderboardPage: React.FC = () => {
	const [gameType, setGameType] = useState<GameType>("board");
	const [viewMode, setViewMode] = useState<ViewMode>("card");
	const leaderboard = usePlayerLeaderboard(gameType);
	const championships = usePlayerChampionships(gameType);
	const hasData = leaderboard.length > 0;
	const maxPoints = hasData ? leaderboard[0].data.points : 0;

	return (
		<div className="mx-auto max-w-6xl">
			<PageHeader
				icon={<Trophy />}
				title="Leaderboard"
				action={
					<div className="flex items-center gap-2 sm:gap-3">
						<SegmentedControl
							value={viewMode}
							onChange={setViewMode}
							options={viewModeOptions}
							hideLabelsOnMobile
						/>
						<SegmentedControl
							value={gameType}
							onChange={setGameType}
							options={gameTypeOptions}
							hideLabelsOnMobile
						/>
					</div>
				}
			/>

			<div className="mt-3 sm:mt-4">
				{!hasData ? (
					<div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center text-sm text-[var(--color-text-secondary)] sm:p-8">
						No results yet. Play some games to populate the board!
					</div>
				) : viewMode === "table" ? (
					<LeaderboardTable leaderboard={leaderboard} championships={championships} />
				) : (
					<div className="space-y-3 sm:space-y-4">
						{leaderboard.map((row, idx) => (
							<PlayerCard
								key={row.id}
								row={row}
								rank={idx + 1}
								maxPoints={maxPoints}
								championshipYears={championships.get(row.id) || []}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default LeaderboardPage;
