import { type PropsWithChildren, useState } from "react";
import { ModalContext } from "common/context/ModalContext";
import type { TModal } from "types/modals";

export const ModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [modal, setModal] = useState<TModal | null>(null);

	return <ModalContext.Provider value={{ modal, setModal }}>{children}</ModalContext.Provider>;
};
