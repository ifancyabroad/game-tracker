import { createContext } from "react";
import type { toast } from "react-hot-toast";

interface IToastContext {
	showToast: typeof toast;
}

export const ToastContext = createContext<IToastContext | undefined>(undefined);
