import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useEffect, useRef } from "react";

export const AppLayout: React.FC = () => {
	const mainRef = useRef<HTMLElement>(null);
	const { pathname } = useLocation();

	useEffect(() => {
		if (mainRef.current) {
			mainRef.current.scrollTop = 0;
		}
	}, [pathname]);

	return (
		<div className="flex h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text)] sm:flex-row">
			<Sidebar />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header />
				<main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};
