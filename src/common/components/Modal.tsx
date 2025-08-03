import { useModal } from "common/context/ModalContext";

export const Modal: React.FC = () => {
	const { isOpen, modalContent, closeModal } = useModal();

	if (!isOpen || !modalContent) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
			<div className="relative w-full max-w-lg rounded-xl border border-gray-700 bg-[var(--color-surface)] p-6 shadow-xl">
				<button onClick={closeModal} className="absolute top-3 right-4 text-xl text-gray-400 hover:text-white">
					✕
				</button>
				{modalContent}
			</div>
		</div>
	);
};
