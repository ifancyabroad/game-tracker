import { Trash2 } from "lucide-react";
import { Button } from "./Button";

interface IConfirmDeleteProps {
	title?: string;
	message?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmDelete: React.FC<IConfirmDeleteProps> = ({
	title = "Delete",
	message = "Are you sure you want to delete this item?",
	onConfirm,
	onCancel,
}) => {
	return (
		<div className="w-full max-w-md rounded-xl bg-[var(--color-surface)]">
			<div className="mb-2 flex items-center gap-2">
				<Trash2 className="h-4 w-4 text-[var(--color-danger)]" />
				<h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
			</div>
			<p className="mb-4 text-sm text-[var(--color-text)]">{message}</p>
			<div className="flex justify-end gap-2">
				<Button type="button" onClick={onCancel} variant="secondary" size="md">
					Cancel
				</Button>
				<Button type="button" onClick={onConfirm} variant="danger" size="md">
					Delete
				</Button>
			</div>
		</div>
	);
};
