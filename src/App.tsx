import { Routes, Route } from "react-router";
import Home from "pages/Home";
import PlayersList from "features/players/pages/PlayersList";
import { Header } from "common/components/Header";

export default function App() {
	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<main className="p-6">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/players" element={<PlayersList />} />
				</Routes>
			</main>
		</div>
	);
}
