import { Edit, Trash2, Plus, Star } from "lucide-react";
import { Button, Card, IconButton, ConfirmDelete, Badge } from "common/components";
import { useSettings } from "common/context/SettingsContext";
import { useToast } from "common/context/ToastContext";
import { useModal } from "common/context/ModalContext";
import { LeaderboardForm } from "./LeaderboardForm";
import { formatDateRange } from "features/leaderboard/utils/helpers";
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

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Button onClick={handleAdd}>
					<Plus className="h-4 w-4" />
					Add Leaderboard
				</Button>
			</div>

			{leaderboards.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{leaderboards
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((leaderboard) => (
							<Card key={leaderboard.id} className="flex flex-col p-4">
								<div className="mb-3 flex items-start justify-between gap-3">
									<div className="flex items-center gap-2">
										<h3 className="text-base font-semibold text-[var(--color-text)]">
											{leaderboard.name}
										</h3>
										{leaderboard.isDefault && <Badge variant="success">Default</Badge>}
									</div>

									<div className="flex items-center gap-1">
										<IconButton
											onClick={() => handleSetDefault(leaderboard)}
											icon={<Star />}
											variant="warning"
											title={leaderboard.isDefault ? "Default leaderboard" : "Set as default"}
											disabled={leaderboard.isDefault}
										/>
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

								<div className="flex-1 space-y-2 text-xs text-[var(--color-text-secondary)]">
									<div>
										<span className="font-medium">Date Range:</span>{" "}
										{formatDateRange(leaderboard.startDate, leaderboard.endDate) || "All time"}
									</div>
									<div>
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
