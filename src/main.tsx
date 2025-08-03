import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "common/context/AuthProvider";
import { ModalProvider } from "common/context/ModalProvider";
import { PlayersProvider } from "features/players/context/PlayersProvider";
import { GamesProvider } from "features/games/context/GamesProvider";
import { EventsProvider } from "features/events/context/EventsProvider";
import { BrowserRouter, Route, Routes } from "react-router";
import { AppLayout } from "common/components/AppLayout";
import { Modal } from "common/components/Modal";
import Home from "pages/Home";
import PlayersList from "features/players/pages/PlayersList";
import GamesPage from "features/games/pages/GamesPage";
import { EventsPage } from "features/events/pages/EventsPage";
import { EventDetailPage } from "features/events/pages/EventDetailPage";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<PlayersProvider>
				<GamesProvider>
					<EventsProvider>
						<ModalProvider>
							<BrowserRouter>
								<Routes>
									<Route element={<AppLayout />}>
										<Route path="/" element={<Home />} />
										<Route path="/players" element={<PlayersList />} />
										<Route path="/games" element={<GamesPage />} />
										<Route path="/events" element={<EventsPage />} />
										<Route path="/events/:eventId" element={<EventDetailPage />} />
									</Route>
								</Routes>
								<Modal />
							</BrowserRouter>
						</ModalProvider>
					</EventsProvider>
				</GamesProvider>
			</PlayersProvider>
		</AuthProvider>
	</StrictMode>,
);
