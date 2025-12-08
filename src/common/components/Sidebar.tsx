import { NavLink } from "react-router";
import { Home, Users, Calendar, Gamepad2, BarChart, X, LogIn, LogOut } from "lucide-react";
import { useUI } from "common/context/UIContext";
import { useModal } from "common/context/ModalContext";
import { LoginForm } from "common/components/LoginForm";
import { useAuth } from "common/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "firebase";

const navItems = [
	{ to: "/", label: "Home", icon: Home },
	{ to: "/players", label: "Players", icon: Users },
	{ to: "/events", label: "Events", icon: Calendar },
	{ to: "/games", label: "Games", icon: Gamepad2 },
	{ to: "/stats", label: "Stats", icon: BarChart },
];

export const Sidebar: React.FC = () => {
	const { isSidebarOpen, closeSidebar } = useUI();
	const { openModal, closeModal } = useModal();
	const user = useAuth();

	const handleLoginClick = () => {
		openModal(<LoginForm onSuccess={closeModal} />);
	};

	const handleLogoutClick = async () => {
		await signOut(auth);
	};

	return (
		<>
			{isSidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 sm:hidden" onClick={closeSidebar} />}

			<aside
				className={`fixed z-50 flex h-full w-56 flex-col border-r border-gray-700 bg-[var(--color-surface)] px-4 py-4 transition-transform sm:static sm:translate-x-0 sm:py-6 ${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
				}`}
			>
				<div className="mb-4 flex items-center justify-between sm:mb-6">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-lg font-bold text-[var(--color-primary-contrast)]">
							🎲
						</div>
						<div>
							<h1 className="text-base leading-tight font-semibold text-white">Game Tracker</h1>
							<p className="text-[10px] text-gray-500">v1.0</p>
						</div>
					</div>
					<button
						onClick={closeSidebar}
						className="text-gray-400 hover:text-white sm:hidden"
						aria-label="Close menu"
					>
						<X size={20} />
					</button>
				</div>

				<nav className="flex flex-col gap-1">
					{navItems.map(({ to, label, icon: Icon }) => (
						<NavLink
							key={to}
							to={to}
							className={({ isActive }) =>
								`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
									isActive
										? "bg-[var(--color-primary)] text-[var(--color-primary-contrast)]"
										: "text-gray-300 hover:bg-[var(--color-primary)]/10 hover:text-white"
								}`
							}
							onClick={closeSidebar}
						>
							<Icon size={16} />
							{label}
						</NavLink>
					))}
				</nav>

				<div className="mt-auto flex flex-col gap-2 pt-6">
					{user ? (
						<button
							onClick={handleLogoutClick}
							className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-black/20 px-3 py-2 text-sm text-gray-200 hover:bg-[var(--color-primary)]/10 focus:ring-2 focus:ring-white/20 focus:outline-none"
						>
							<LogOut size={16} />
							Logout
						</button>
					) : (
						<button
							onClick={handleLoginClick}
							className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-black/20 px-3 py-2 text-sm text-gray-200 hover:bg-[var(--color-primary)]/10 focus:ring-2 focus:ring-white/20 focus:outline-none"
						>
							<LogIn size={16} />
							Login
						</button>
					)}
				</div>
			</aside>
		</>
	);
};
