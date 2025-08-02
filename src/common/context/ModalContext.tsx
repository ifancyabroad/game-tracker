import React from "react";
import type { TModal } from "types/modals";

interface ModalContextType {
	modal: TModal | null;
	setModal: React.Dispatch<React.SetStateAction<TModal | null>>;
}

export const ModalContext = React.createContext<ModalContextType>({
	modal: null,
	setModal: () => {},
});
