import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "common/context/AuthProvider";
import { ModalProvider } from "common/context/ModalProvider";
import { PlayersProvider } from "features/players/context/PlayersProvider";
import { GamesProvider } from "features/games/context/GamesProvider";
import { EventsProvider } from "features/events/context/EventsProvider";
import { ResultsProvider } from "features/events/context/ResultsProvider";
import { BrowserRouter, Route, Routes } from "react-router";
import { AppLayout } from "common/components/AppLayout";
import { Modal } from "common/components/Modal";
import HomePage from "features/leaderboard/pages/HomePage";
import PlayersList from "features/players/pages/PlayersList";
import PlayerStatsPage from "features/players/pages/PlayerStatsPage";
import GamesPage from "features/games/pages/GamesPage";
import { EventsPage } from "features/events/pages/EventsPage";
import { EventDetailPage } from "features/events/pages/EventDetailPage";
import { UIProvider } from "common/context/UIProvider";
import { StatsPage } from "features/stats/pages/StatsPage";
import { ReadyGate } from "common/components/ReadyGate";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<PlayersProvider>
				<GamesProvider>
					<EventsProvider>
						<ResultsProvider>
							<UIProvider>
								<ModalProvider>
									<ReadyGate>
										<BrowserRouter>
											<Routes>
												<Route element={<AppLayout />}>
													<Route path="/" element={<HomePage />} />
													<Route path="/players" element={<PlayersList />} />
													<Route path="/players/:id" element={<PlayerStatsPage />} />
													<Route path="/games" element={<GamesPage />} />
													<Route path="/events" element={<EventsPage />} />
													<Route path="/events/:eventId" element={<EventDetailPage />} />
													<Route path="/stats" element={<StatsPage />} />
													<Route path="*" element={<div>404 Not Found</div>} />
												</Route>
											</Routes>
											<Modal />
										</BrowserRouter>
									</ReadyGate>
								</ModalProvider>
							</UIProvider>
						</ResultsProvider>
					</EventsProvider>
				</GamesProvider>
			</PlayersProvider>
		</AuthProvider>
	</StrictMode>,
);
