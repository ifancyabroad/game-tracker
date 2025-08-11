import { Trash2 } from "lucide-react";

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
				<Trash2 className="h-4 w-4 text-red-400" />
				<h3 className="text-sm font-semibold text-white">{title}</h3>
			</div>
			<p className="mb-4 text-sm text-gray-300">{message}</p>
			<div className="flex justify-end gap-2">
				<button
					type="button"
					onClick={onCancel}
					className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-black/20 px-3 py-2 text-sm text-gray-200 hover:bg-[var(--color-primary)]/10 focus:ring-2 focus:ring-white/20 focus:outline-none"
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={onConfirm}
					className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 focus:ring-2 focus:ring-red-400 focus:outline-none"
				>
					Delete
				</button>
			</div>
		</div>
	);
};
