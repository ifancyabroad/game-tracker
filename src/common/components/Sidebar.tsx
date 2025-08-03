import { NavLink } from "react-router";
import { Home, Users, Calendar, Gamepad2, BarChart, X } from "lucide-react";
import { useUI } from "common/context/UIContext";

const navItems = [
	{ to: "/", label: "Home", icon: Home },
	{ to: "/players", label: "Players", icon: Users },
	{ to: "/events", label: "Events", icon: Calendar },
	{ to: "/games", label: "Games", icon: Gamepad2 },
	{ to: "/stats", label: "Stats", icon: BarChart },
];

export const Sidebar: React.FC = () => {
	const { isSidebarOpen, closeSidebar } = useUI();

	return (
		<>
			{/* Overlay for mobile */}
			{isSidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 sm:hidden" onClick={closeSidebar} />}

			<aside
				className={`fixed z-40 h-full w-64 flex-col border-r border-gray-800 bg-[var(--color-surface)] p-4 transition-transform sm:static sm:translate-x-0 ${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{/* Logo and Close (mobile only) */}
				<div className="mb-6 flex items-center justify-between sm:justify-start sm:gap-3">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-lg font-bold text-[var(--color-primary-contrast)]">
							🎲
						</div>
						<div>
							<h1 className="text-base leading-tight font-medium text-[var(--color-primary)]">
								Game Tracker
							</h1>
							<p className="text-[10px] text-gray-500">v1.0</p>
						</div>
					</div>

					{/* Close Button (mobile only) */}
					<button
						onClick={closeSidebar}
						className="text-gray-400 hover:text-white sm:hidden"
						aria-label="Close menu"
					>
						<X size={20} />
					</button>
				</div>

				<hr className="mb-4 border-gray-700" />

				<nav className="flex flex-col gap-2">
					{navItems.map(({ to, label, icon: Icon }) => (
						<NavLink
							key={to}
							to={to}
							className={({ isActive }) =>
								`nav-link ${
									isActive
										? "bg-[var(--color-primary)] font-semibold text-[var(--color-primary-contrast)]"
										: "hover:bg-opacity-20 hover:bg-[var(--color-primary)]"
								}`
							}
							onClick={closeSidebar}
						>
							<Icon size={18} />
							{label}
						</NavLink>
					))}
				</nav>
			</aside>
		</>
	);
};
