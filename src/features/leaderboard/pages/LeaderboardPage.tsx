import React, { useState } from "react";
import { Trophy, LayoutGrid, List } from "lucide-react";
import {
	usePlayerLeaderboard,
	useDefaultLeaderboard,
	useLeaderboardById,
	useLeaderboardFilters,
	useChampionshipMap,
	useLeaderboardStatus,
} from "features/leaderboard/utils/hooks";
import { PlayerCard } from "features/leaderboard/components/PlayerCard";
import { LeaderboardTable } from "features/leaderboard/components/LeaderboardTable";
import { LeaderboardSelector } from "features/leaderboard/components/LeaderboardSelector";
import { SegmentedControl, PageHeader } from "common/components";
import type { SegmentedControlOption } from "common/components/SegmentedControl";
import { useSettings } from "common/context/SettingsContext";

type ViewMode = "card" | "table";

const viewModeOptions: SegmentedControlOption<ViewMode>[] = [
	{ value: "card", label: "Cards", icon: LayoutGrid },
	{ value: "table", label: "Table", icon: List },
];

export const LeaderboardPage: React.FC = () => {
	const { settings } = useSettings();
	const [viewMode, setViewMode] = useState<ViewMode>("card");

	const leaderboards = settings?.leaderboards || [];
	const defaultLeaderboard = useDefaultLeaderboard();

	const [selectedLeaderboardId, setSelectedLeaderboardId] = useState<string>(
		() => defaultLeaderboard?.id || leaderboards[0]?.id || "",
	);

	const selectedLeaderboard = useLeaderboardById(selectedLeaderboardId) || defaultLeaderboard;
	const filters = useLeaderboardFilters(selectedLeaderboardId);

	const leaderboard = usePlayerLeaderboard(filters);
	const championshipMap = useChampionshipMap(filters, selectedLeaderboard);
	const leaderboardStatus = useLeaderboardStatus(selectedLeaderboard);

	const hasData = leaderboard.length > 0;
	const maxPoints = hasData ? leaderboard[0].data.points : 0;

	return (
		<div className="mx-auto max-w-6xl">
			<PageHeader
				icon={<Trophy />}
				title="Leaderboard"
				action={
					<SegmentedControl
						value={viewMode}
						onChange={setViewMode}
						options={viewModeOptions}
						hideLabelsOnMobile
					/>
				}
			/>

			{/* Leaderboard Selector */}
			{leaderboards.length > 0 && (
				<div className="mb-4">
					<LeaderboardSelector
						leaderboards={leaderboards}
						selectedLeaderboardId={selectedLeaderboardId}
						onSelectLeaderboard={setSelectedLeaderboardId}
						selectedStatus={leaderboardStatus}
					/>
				</div>
			)}

			<div className="mt-4 sm:mt-6">
				{!hasData ? (
					<div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center text-sm text-[var(--color-text-secondary)] sm:p-8">
						{leaderboards.length === 0
							? "No leaderboards configured. Admins can configure leaderboards in Settings."
							: "No results match this leaderboard's filters."}
					</div>
				) : viewMode === "table" ? (
					<LeaderboardTable leaderboard={leaderboard} championships={championshipMap} />
				) : (
					<div className="space-y-3 sm:space-y-4">
						{leaderboard.map((row, idx) => (
							<PlayerCard
								key={row.id}
								row={row}
								rank={idx + 1}
								maxPoints={maxPoints}
								isChampion={championshipMap.has(row.id)}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default LeaderboardPage;
