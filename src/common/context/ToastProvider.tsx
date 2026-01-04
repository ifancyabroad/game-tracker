import { Toaster, toast } from "react-hot-toast";
import { ToastContext } from "./ToastContext";

interface IToastProviderProps {
	children: React.ReactNode;
}

export function ToastProvider({ children }: IToastProviderProps) {
	return (
		<ToastContext.Provider value={{ showToast: toast }}>
			{children}
			<Toaster
				position="bottom-right"
				toastOptions={{
					duration: 4000,
					style: {
						background: "var(--color-surface)",
						color: "var(--color-text)",
						border: "1px solid var(--color-border)",
					},
					success: {
						iconTheme: {
							primary: "var(--color-success)",
							secondary: "var(--color-success-contrast)",
						},
					},
					error: {
						iconTheme: {
							primary: "var(--color-danger)",
							secondary: "var(--color-danger-contrast)",
						},
					},
				}}
				containerStyle={{
					bottom: 24,
					right: 24,
				}}
				gutter={8}
			/>
		</ToastContext.Provider>
	);
}
