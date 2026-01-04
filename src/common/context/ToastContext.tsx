import { createContext, useContext } from "react";
import type { toast } from "react-hot-toast";

interface IToastContext {
	showToast: typeof toast;
}

export const ToastContext = createContext<IToastContext | undefined>(undefined);

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context.showToast;
};
