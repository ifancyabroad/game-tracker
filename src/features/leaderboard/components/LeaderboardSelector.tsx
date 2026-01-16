import React, { useState } from "react";
import { ChevronDown, CheckCircle2, Clock, Zap, Calendar } from "lucide-react";
import type { ILeaderboard, LeaderboardStatus } from "features/settings/types";
import { formatDateRange, getLeaderboardStatus } from "features/leaderboard/utils/calculations";
import { useSortedLeaderboards } from "features/leaderboard/utils/hooks";

interface LeaderboardSelectorProps {
	leaderboards: ILeaderboard[];
	selectedLeaderboardId: string;
	onSelectLeaderboard: (id: string) => void;
	selectedStatus: LeaderboardStatus;
}

const getStatusConfig = (status: LeaderboardStatus) => {
	if (status === "complete") {
		return {
			icon: CheckCircle2,
			color: "text-[var(--color-text-secondary)]",
			bgColor: "bg-[var(--color-accent)]",
			label: "Completed",
		};
	}
	if (status === "scheduled") {
		return {
			icon: Clock,
			color: "text-[var(--color-info)]",
			bgColor: "bg-[var(--color-info)]/10",
			label: "Scheduled",
		};
	}
	return {
		icon: Zap,
		color: "text-[var(--color-success)]",
		bgColor: "bg-[var(--color-success)]/10",
		label: "Active",
	};
};

export const LeaderboardSelector: React.FC<LeaderboardSelectorProps> = ({
	leaderboards,
	selectedLeaderboardId,
	onSelectLeaderboard,
	selectedStatus,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const sortedLeaderboards = useSortedLeaderboards(leaderboards);
	const selectedLeaderboard = leaderboards.find((lb) => lb.id === selectedLeaderboardId);

	if (leaderboards.length <= 1) {
		if (!selectedLeaderboard) return null;

		const dateRangeText = formatDateRange(selectedLeaderboard.startDate, selectedLeaderboard.endDate);
		const statusConfig = getStatusConfig(selectedStatus);
		const StatusIcon = statusConfig.icon;

		return (
			<div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<h3 className="text-base font-semibold text-[var(--color-text)] sm:text-lg">
							{selectedLeaderboard.name}
						</h3>
						{dateRangeText && (
							<div className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
								<Calendar className="h-3.5 w-3.5" />
								<span>{dateRangeText}</span>
							</div>
						)}
					</div>
					<div
						className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
					>
						<StatusIcon className="h-4 w-4" />
						<span className="hidden sm:inline">{statusConfig.label}</span>
					</div>
				</div>
			</div>
		);
	}

	if (!selectedLeaderboard) return null;

	const dateRangeText = formatDateRange(selectedLeaderboard.startDate, selectedLeaderboard.endDate);
	const statusConfig = getStatusConfig(selectedStatus);
	const StatusIcon = statusConfig.icon;

	return (
		<div className="relative">
			{/* Selected Leaderboard Display */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-left shadow-sm transition-all hover:border-[var(--color-primary)]/50 hover:shadow-md"
			>
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2">
							<h3 className="text-base font-semibold text-[var(--color-text)] sm:text-lg">
								{selectedLeaderboard.name}
							</h3>
							<ChevronDown
								className={`h-4 w-4 text-[var(--color-text-secondary)] transition-transform ${isOpen ? "rotate-180" : ""}`}
							/>
						</div>
						{dateRangeText && (
							<div className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
								<Calendar className="h-3.5 w-3.5" />
								<span>{dateRangeText}</span>
							</div>
						)}
					</div>
					<div
						className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
					>
						<StatusIcon className="h-4 w-4" />
						<span className="hidden sm:inline">{statusConfig.label}</span>
					</div>
				</div>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<>
					{/* Backdrop */}
					<div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

					{/* Dropdown */}
					<div className="absolute top-full right-0 left-0 z-20 mt-2 max-h-96 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
						{sortedLeaderboards.map((lb) => {
							const isSelected = lb.id === selectedLeaderboardId;
							const lbDateRange = formatDateRange(lb.startDate, lb.endDate);
							const lbStatus = getLeaderboardStatus(lb);
							const lbStatusConfig = getStatusConfig(lbStatus);

							const LbStatusIcon = lbStatusConfig.icon;

							return (
								<button
									key={lb.id}
									onClick={() => {
										onSelectLeaderboard(lb.id);
										setIsOpen(false);
									}}
									className={`w-full border-b border-[var(--color-border)] p-4 text-left transition-colors last:border-b-0 hover:bg-[var(--color-hover)] ${
										isSelected ? "bg-[var(--color-accent)]" : ""
									}`}
								>
									<div className="flex items-start justify-between gap-4">
										<div className="min-w-0 flex-1">
											<h4
												className={`text-sm font-semibold sm:text-base ${
													isSelected
														? "text-[var(--color-primary)]"
														: "text-[var(--color-text)]"
												}`}
											>
												{lb.name}
											</h4>
											{lbDateRange && (
												<div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] sm:text-sm">
													<Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
													<span>{lbDateRange}</span>
												</div>
											)}
										</div>
										<div
											className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium sm:gap-1.5 sm:px-3 sm:text-sm ${lbStatusConfig.bgColor} ${lbStatusConfig.color}`}
										>
											<LbStatusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
											<span className="hidden sm:inline">{lbStatusConfig.label}</span>
										</div>
									</div>
								</button>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
};
