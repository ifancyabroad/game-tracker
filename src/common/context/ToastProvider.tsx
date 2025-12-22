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
							primary: "var(--color-primary)",
							secondary: "white",
						},
					},
					error: {
						iconTheme: {
							primary: "#ef4444",
							secondary: "white",
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
