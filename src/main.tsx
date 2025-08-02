import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "common/providers/AuthProvider.tsx";
import { DataProvider } from "common/providers/DataProvider";
import { ModalProvider } from "common/providers/ModalProvider";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "pages/Home";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<DataProvider>
				<ModalProvider>
					<BrowserRouter>
						<Routes>
							<Route index element={<Home />} />
						</Routes>
					</BrowserRouter>
				</ModalProvider>
			</DataProvider>
		</AuthProvider>
	</StrictMode>,
);
