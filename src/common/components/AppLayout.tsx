import { NavLink, Outlet } from "react-router";
import { Home, Users, Calendar, BarChart, Gamepad2 } from "lucide-react";

const navItems = [
	{ to: "/", label: "Home", icon: Home },
	{ to: "/players", label: "Players", icon: Users },
	{ to: "/events", label: "Events", icon: Calendar },
	{ to: "/games", label: "Games", icon: Gamepad2 },
	{ to: "/stats", label: "Stats", icon: BarChart },
];

export const AppLayout: React.FC = () => {
	return (
		<div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
			<aside className="flex w-64 flex-col border-r border-gray-800 bg-[var(--color-surface)] p-4">
				<div className="mb-6 flex items-center gap-3 px-1">
					<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-lg font-bold text-[var(--color-primary-contrast)]">
						🎲
					</div>
					<div>
						<h1 className="text-lg leading-tight font-semibold text-[var(--color-primary)]">
							Game Tracker
						</h1>
						<p className="text-xs text-gray-400">v1.0</p>
					</div>
				</div>

				<hr className="mb-4 border-t border-gray-700" />

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
						>
							<Icon size={18} />
							{label}
						</NavLink>
					))}
				</nav>
			</aside>

			<main className="flex-1 overflow-y-auto p-6">
				<Outlet />
			</main>
		</div>
	);
};
