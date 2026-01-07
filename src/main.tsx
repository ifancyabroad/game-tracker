import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "common/context/AuthProvider";
import { ModalProvider } from "common/context/ModalProvider";
import { ToastProvider } from "common/context/ToastProvider";
import { UsersProvider } from "features/users/context/UsersProvider";
import { PlayersProvider } from "features/players/context/PlayersProvider";
import { GamesProvider } from "features/games/context/GamesProvider";
import { EventsProvider } from "features/events/context/EventsProvider";
import { ResultsProvider } from "features/events/context/ResultsProvider";
import { BrowserRouter, Route, Routes } from "react-router";
import { AppLayout, Modal, ReadyGate, ErrorBoundary } from "common/components";
import HomePage from "features/dashboard/pages/HomePage";
import LeaderboardPage from "features/leaderboard/pages/LeaderboardPage";
import PlayersList from "features/players/pages/PlayersList";
import PlayerStatsPage from "features/players/pages/PlayerStatsPage";
import GamesPage from "features/games/pages/GamesPage";
import GameStatsPage from "features/games/pages/GameStatsPage";
import { EventsPage } from "features/events/pages/EventsPage";
import { EventDetailPage } from "features/events/pages/EventDetailPage";
import { UIProvider } from "common/context/UIProvider";
import { SettingsProvider } from "common/context/SettingsProvider";
import { StatsPage } from "features/stats/pages/StatsPage";
import { UsersList } from "features/users/pages/UsersList";
import { ProfilePage } from "features/users/pages/ProfilePage";
import { SettingsPage } from "features/settings/pages/SettingsPage";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary>
			<AuthProvider>
				<SettingsProvider>
					<UsersProvider>
						<PlayersProvider>
							<GamesProvider>
								<EventsProvider>
									<ResultsProvider>
										<UIProvider>
											<ModalProvider>
												<ToastProvider>
													<ReadyGate>
														<BrowserRouter>
															<Routes>
																<Route element={<AppLayout />}>
																	<Route path="/" element={<HomePage />} />
																	<Route
																		path="/leaderboard"
																		element={<LeaderboardPage />}
																	/>
																	<Route path="/players" element={<PlayersList />} />
																	<Route
																		path="/players/:id"
																		element={<PlayerStatsPage />}
																	/>
																	<Route path="/games" element={<GamesPage />} />
																	<Route
																		path="/games/:id"
																		element={<GameStatsPage />}
																	/>
																	<Route path="/events" element={<EventsPage />} />
																	<Route
																		path="/events/:eventId"
																		element={<EventDetailPage />}
																	/>
																	<Route path="/stats" element={<StatsPage />} />
																	<Route path="/profile" element={<ProfilePage />} />
																	<Route path="/users" element={<UsersList />} />
																	<Route
																		path="/settings"
																		element={<SettingsPage />}
																	/>
																	<Route
																		path="*"
																		element={<div>404 Not Found</div>}
																	/>
																</Route>
															</Routes>
															<Modal />
														</BrowserRouter>
													</ReadyGate>
												</ToastProvider>
											</ModalProvider>
										</UIProvider>
									</ResultsProvider>
								</EventsProvider>
							</GamesProvider>
						</PlayersProvider>
					</UsersProvider>
				</SettingsProvider>
			</AuthProvider>
		</ErrorBoundary>
	</StrictMode>,
);
