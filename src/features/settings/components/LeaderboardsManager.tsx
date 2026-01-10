import { Edit, Trash2, Plus, Star } from "lucide-react";
import { Button, Card, IconButton, ConfirmDelete, Badge } from "common/components";
import { useSettings } from "common/context/SettingsContext";
import { useToast } from "common/context/ToastContext";
import { useModal } from "common/context/ModalContext";
import { LeaderboardForm } from "./LeaderboardForm";
import { format } from "date-fns";
import type { ILeaderboard } from "features/settings/types";

export const LeaderboardsManager: React.FC = () => {
	const { settings, addLeaderboard, editLeaderboard, deleteLeaderboard, setDefaultLeaderboard } = useSettings();
	const toast = useToast();
	const { openModal, closeModal } = useModal();

	const leaderboards = settings?.leaderboards || [];

	const handleAdd = () => {
		openModal(
			<LeaderboardForm
				onSubmit={async (data) => {
					try {
						await addLeaderboard(data);
						closeModal();
						toast.success("Leaderboard added successfully");
					} catch {
						toast.error("Failed to add leaderboard");
					}
				}}
			/>,
		);
	};

	const handleEdit = (leaderboard: ILeaderboard) => {
		openModal(
			<LeaderboardForm
				initialData={leaderboard}
				onSubmit={async (data) => {
					try {
						await editLeaderboard(leaderboard.id, data);
						closeModal();
						toast.success("Leaderboard updated successfully");
					} catch {
						toast.error("Failed to update leaderboard");
					}
				}}
			/>,
		);
	};

	const handleDelete = (leaderboard: ILeaderboard) => {
		openModal(
			<ConfirmDelete
				title="Delete Leaderboard"
				message={`Are you sure you want to delete the leaderboard "${leaderboard.name}"?`}
				onConfirm={async () => {
					try {
						await deleteLeaderboard(leaderboard.id);
						closeModal();
						toast.success("Leaderboard deleted successfully");
					} catch {
						toast.error("Failed to delete leaderboard");
					}
				}}
				onCancel={closeModal}
			/>,
		);
	};

	const handleSetDefault = async (leaderboard: ILeaderboard) => {
		if (leaderboard.isDefault) return;
		try {
			await setDefaultLeaderboard(leaderboard.id);
			toast.success(`"${leaderboard.name}" set as default leaderboard`);
		} catch {
			toast.error("Failed to set default leaderboard");
		}
	};

	const formatDateRange = (startDate?: string, endDate?: string) => {
		if (!startDate && !endDate) return "All time";
		if (startDate && endDate) {
			return `${format(new Date(startDate), "MMM d, yyyy")} - ${format(new Date(endDate), "MMM d, yyyy")}`;
		}
		if (startDate) return `From ${format(new Date(startDate), "MMM d, yyyy")}`;
		if (endDate) return `Until ${format(new Date(endDate), "MMM d, yyyy")}`;
		return "All time";
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-[var(--color-text-secondary)]">{leaderboards.length} configured</p>
				<Button onClick={handleAdd}>
					<Plus className="h-4 w-4" />
					Add Leaderboard
				</Button>
			</div>

			{leaderboards.length > 0 ? (
				<div className="space-y-3">
					{leaderboards
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((leaderboard) => (
							<Card key={leaderboard.id} className="p-4">
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0 flex-1 space-y-2">
										<div className="flex items-center gap-2">
											<h3 className="text-sm font-semibold text-[var(--color-text)]">
												{leaderboard.name}
											</h3>
											{leaderboard.isDefault && (
												<Badge variant="success">
													<Star className="h-3 w-3" />
													Default
												</Badge>
											)}
										</div>

										<div className="text-xs text-[var(--color-text-secondary)]">
											<div className="mb-1">
												<span className="font-medium">Date Range:</span>{" "}
												{formatDateRange(leaderboard.startDate, leaderboard.endDate)}
											</div>
											<div className="mb-1">
												<span className="font-medium">Game Tags:</span>{" "}
												{leaderboard.gameTags.length > 0
													? leaderboard.gameTags.join(", ")
													: "All games"}
											</div>
											<div>
												<span className="font-medium">Players:</span>{" "}
												{leaderboard.playerIds.length > 0
													? `${leaderboard.playerIds.length} selected`
													: "All players"}
											</div>
										</div>
									</div>

									<div className="flex items-center gap-1">
										{!leaderboard.isDefault && (
											<IconButton
												onClick={() => handleSetDefault(leaderboard)}
												icon={<Star />}
												variant="secondary"
												title="Set as default"
											/>
										)}
										<IconButton
											onClick={() => handleEdit(leaderboard)}
											icon={<Edit />}
											variant="secondary"
											title="Edit"
										/>
										<IconButton
											onClick={() => handleDelete(leaderboard)}
											icon={<Trash2 />}
											variant="danger"
											title="Delete"
										/>
									</div>
								</div>
							</Card>
						))}
				</div>
			) : (
				<p className="text-sm text-[var(--color-text-secondary)]">
					No leaderboards configured. Add one to get started.
				</p>
			)}
		</div>
	);
};
