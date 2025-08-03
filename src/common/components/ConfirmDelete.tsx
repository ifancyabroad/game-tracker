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
		<div className="flex flex-col gap-4">
			<h3 className="text-xl font-bold text-red-400">{title}</h3>
			<p className="text-sm text-gray-300">{message}</p>
			<div className="mt-4 flex justify-end gap-2">
				<button onClick={onCancel} className="rounded bg-gray-700 px-4 py-2 text-gray-200 hover:bg-gray-600">
					Cancel
				</button>
				<button onClick={onConfirm} className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500">
					Delete
				</button>
			</div>
		</div>
	);
};
