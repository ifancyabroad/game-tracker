import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "common/context/AuthProvider";
import { ModalProvider } from "common/context/ModalProvider";
import { PlayersProvider } from "features/players/context/PlayersProvider";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "pages/Home";
import PlayersList from "features/players/pages/PlayersList";
import { AppLayout } from "common/components/AppLayout";
import { Modal } from "common/components/Modal";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<PlayersProvider>
				<ModalProvider>
					<BrowserRouter>
						<Routes>
							<Route element={<AppLayout />}>
								<Route path="/" element={<Home />} />
								<Route path="/players" element={<PlayersList />} />
							</Route>
						</Routes>
						<Modal />
					</BrowserRouter>
				</ModalProvider>
			</PlayersProvider>
		</AuthProvider>
	</StrictMode>,
);
