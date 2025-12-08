import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const AppLayout: React.FC = () => {
	return (
		<div className="flex h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text)] sm:flex-row">
			<Sidebar />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header />
				<main className="flex-1 overflow-y-auto p-4 sm:p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};
