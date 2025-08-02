import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "common/context/AuthProvider";
import { ModalProvider } from "common/context/ModalProvider";
import { PlayersProvider } from "features/players/context/PlayersProvider";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<PlayersProvider>
				<ModalProvider>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</ModalProvider>
			</PlayersProvider>
		</AuthProvider>
	</StrictMode>,
);
