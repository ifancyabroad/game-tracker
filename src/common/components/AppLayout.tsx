import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useEffect } from "react";

export const AppLayout: React.FC = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		// Scroll to top on route change
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
			<Sidebar />
			<div className="flex min-h-screen flex-col lg:pl-72">
				<Header />
				<main className="flex-1 p-4 sm:p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};
