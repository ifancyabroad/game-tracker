import React, { useState } from "react";
import { Trophy, LayoutGrid, List } from "lucide-react";
import {
	usePlayerLeaderboard,
	useDefaultLeaderboard,
	useLeaderboardById,
	useLeaderboardFilters,
	useChampionshipMap,
} from "features/leaderboard/utils/hooks";
import { PlayerCard } from "features/leaderboard/components/PlayerCard";
import { LeaderboardTable } from "features/leaderboard/components/LeaderboardTable";
import { SegmentedControl, PageHeader, Select, Badge } from "common/components";
import type { SegmentedControlOption } from "common/components/SegmentedControl";
import { useSettings } from "common/context/SettingsContext";
import { formatDateRange } from "features/leaderboard/utils/calculations";

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
	const championshipMap = useChampionshipMap(filters);

	const hasData = leaderboard.length > 0;
	const maxPoints = hasData ? leaderboard[0].data.points : 0;
	const champion = leaderboard.length > 0 ? leaderboard[0] : null;

	const dateRangeText = selectedLeaderboard
		? formatDateRange(selectedLeaderboard.startDate, selectedLeaderboard.endDate)
		: null;

	return (
		<div className="mx-auto max-w-6xl">
			<PageHeader
				icon={<Trophy />}
				title="Leaderboard"
				action={
					<div className="flex items-center gap-2 sm:gap-3">
						{leaderboards.length > 1 && (
							<Select
								value={selectedLeaderboardId}
								onChange={(e) => setSelectedLeaderboardId(e.target.value)}
								className="min-w-[150px]"
							>
								{leaderboards
									.sort((a, b) => a.name.localeCompare(b.name))
									.map((lb) => (
										<option key={lb.id} value={lb.id}>
											{lb.name}
										</option>
									))}
							</Select>
						)}
						<SegmentedControl
							value={viewMode}
							onChange={setViewMode}
							options={viewModeOptions}
							hideLabelsOnMobile
						/>
					</div>
				}
			/>

			{selectedLeaderboard && dateRangeText && (
				<div className="mt-2 flex items-center gap-2">
					<Badge variant="default">{dateRangeText}</Badge>
				</div>
			)}

			{champion && (
				<div className="mt-3 rounded-lg bg-[var(--color-accent)] p-3 text-center">
					<p className="text-sm text-[var(--color-text-secondary)]">
						<Trophy className="inline h-4 w-4 text-[var(--color-gold)]" /> Champion:{" "}
						<span className="font-semibold text-[var(--color-text)]">
							{champion.preferredName || champion.firstName}
						</span>{" "}
						with {champion.data.points} points
					</p>
				</div>
			)}

			<div className="mt-3 sm:mt-4">
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
								championshipYears={championshipMap.get(row.id) || []}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default LeaderboardPage;
