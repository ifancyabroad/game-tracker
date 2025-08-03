import { useModal } from "common/context/ModalContext";
import { AnimatePresence, motion } from "framer-motion";

export const Modal: React.FC = () => {
	const { isOpen, modalContent, closeModal } = useModal();

	return (
		<AnimatePresence>
			{isOpen && modalContent && (
				<motion.div
					className="fixed inset-0 z-50 overflow-y-auto bg-black/60 px-4 py-8"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<div className="flex min-h-full items-center justify-center">
						<motion.div
							initial={{ opacity: 0, y: 40, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 40, scale: 0.95 }}
							transition={{ duration: 0.2, ease: "easeInOut" }}
							className="relative w-full max-w-lg rounded-xl border border-gray-700 bg-[var(--color-surface)] p-6 shadow-xl"
						>
							<button
								onClick={closeModal}
								className="absolute top-3 right-4 text-xl text-gray-400 hover:text-white"
							>
								✕
							</button>
							{modalContent}
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
