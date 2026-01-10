import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, Input, Chip, ConfirmDelete } from "common/components";
import { useSettings } from "common/context/SettingsContext";
import { useToast } from "common/context/ToastContext";
import { useModal } from "common/context/ModalContext";

export const GameTagsManager: React.FC = () => {
	const { settings, addGameTag, deleteGameTag } = useSettings();
	const toast = useToast();
	const { openModal, closeModal } = useModal();
	const [newTagName, setNewTagName] = useState("");
	const [isAdding, setIsAdding] = useState(false);

	const gameTags = settings?.gameTags || [];

	const handleAddTag = async () => {
		const trimmed = newTagName.trim();
		if (!trimmed) {
			toast.error("Tag name cannot be empty");
			return;
		}

		if (gameTags.includes(trimmed)) {
			toast.error("Tag already exists");
			return;
		}

		setIsAdding(true);
		try {
			await addGameTag(trimmed);
			toast.success("Tag added successfully");
			setNewTagName("");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to add tag");
		} finally {
			setIsAdding(false);
		}
	};

	const handleDeleteTag = async (tag: string) => {
		openModal(
			<ConfirmDelete
				title="Delete Tag"
				message={`Are you sure you want to delete the tag "${tag}"? This will remove the tag from all games and may affect leaderboard configurations.`}
				onConfirm={async () => {
					try {
						const result = await deleteGameTag(tag);
						closeModal();
						if (result.usageCount > 0) {
							toast.success(
								`Tag deleted and removed from ${result.usageCount} ${result.usageCount === 1 ? "game" : "games"}`,
							);
						} else {
							toast.success("Tag deleted successfully");
						}
					} catch (error) {
						closeModal();
						toast.error(error instanceof Error ? error.message : "Failed to delete tag");
					}
				}}
				onCancel={closeModal}
			/>,
		);
	};

	return (
		<div className="space-y-4">
			<div className="flex gap-2">
				<Input
					type="text"
					value={newTagName}
					onChange={(e) => setNewTagName(e.target.value)}
					placeholder="Enter tag name..."
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							handleAddTag();
						}
					}}
					maxLength={50}
				/>
				<Button onClick={handleAddTag} disabled={isAdding || !newTagName.trim()}>
					<Plus className="h-4 w-4" />
					Add
				</Button>
			</div>

			{gameTags.length > 0 ? (
				<div className="flex flex-wrap gap-2">
					{gameTags.map((tag) => (
						<div key={tag} className="group relative">
							<Chip label={tag} active />
							<button
								type="button"
								onClick={() => handleDeleteTag(tag)}
								className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-danger)] text-white opacity-0 transition-opacity group-hover:opacity-100"
								title="Delete tag"
							>
								<Trash2 className="h-3 w-3" />
							</button>
						</div>
					))}
				</div>
			) : (
				<p className="text-sm text-[var(--color-text-secondary)]">No tags defined yet.</p>
			)}
		</div>
	);
};
