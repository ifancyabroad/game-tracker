import { type PropsWithChildren, useCallback, useState } from "react";
import { ModalContext } from "common/context/ModalContext";

export const ModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);

	const openModal = useCallback((content: React.ReactNode) => {
		setModalContent(content);
		setIsOpen(true);
	}, []);

	const closeModal = useCallback(() => {
		setIsOpen(false);
		setModalContent(null);
	}, []);

	return (
		<ModalContext.Provider value={{ isOpen, modalContent, openModal, closeModal }}>
			{children}
		</ModalContext.Provider>
	);
};
