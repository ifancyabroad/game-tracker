import { NavLink } from "react-router";
import {
	Home,
	Users,
	Calendar,
	Gamepad2,
	BarChart,
	X,
	LogIn,
	LogOut,
	CalendarRange,
	Sun,
	Moon,
	Trophy,
} from "lucide-react";
import { useUI } from "common/context/UIContext";
import { useModal } from "common/context/ModalContext";
import { LoginForm, Select, Button, Label, SegmentedControl } from "common/components";
import type { SegmentedControlOption } from "common/components/SegmentedControl";
import { useAuth } from "common/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "firebase";
import { Link } from "react-router";
import logo from "assets/logo.svg";
import { useEffect } from "react";
import type { Theme } from "common/utils/theme";
import { useBodyScrollLock } from "common/utils/hooks";

const navItems = [
	{ to: "/", label: "Home", icon: Home },
	{ to: "/leaderboard", label: "Leaderboard", icon: Trophy },
	{ to: "/players", label: "Players", icon: Users },
	{ to: "/events", label: "Events", icon: Calendar },
	{ to: "/games", label: "Games", icon: Gamepad2 },
	{ to: "/stats", label: "Stats", icon: BarChart },
];

const themeOptions: SegmentedControlOption<Theme>[] = [
	{ value: "light", label: "Light", icon: Sun },
	{ value: "dark", label: "Dark", icon: Moon },
];

export const Sidebar: React.FC = () => {
	const { isSidebarOpen, closeSidebar, selectedYear, setSelectedYear, availableYears, theme, updateTheme } = useUI();
	const { openModal, closeModal } = useModal();
	const { user } = useAuth();

	// Lock body scroll when sidebar is open on mobile
	useBodyScrollLock(isSidebarOpen);

	const handleLoginClick = () => {
		openModal(<LoginForm onSuccess={closeModal} />);
	};

	const handleLogoutClick = async () => {
		await signOut(auth);
	};

	// Handle Escape key to close sidebar on mobile
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isSidebarOpen) {
				closeSidebar();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isSidebarOpen, closeSidebar]);

	return (
		<>
			{isSidebarOpen && (
				<div
					className="fixed inset-0 z-50 bg-black/50 lg:hidden"
					onClick={closeSidebar}
					aria-label="Close sidebar"
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							closeSidebar();
						}
					}}
				/>
			)}

			<aside
				className={`fixed inset-y-0 left-0 z-[60] flex w-72 flex-col overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 transition-transform lg:py-6 ${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
				}`}
			>
				<div className="mb-4 flex items-center justify-between lg:mb-6">
					<Link to="/" className="flex items-center gap-3" onClick={closeSidebar}>
						<div className="flex h-9 w-9 items-center justify-center">
							<img src={logo} alt="Logo" />
						</div>
						<div>
							<h1 className="font-display text-base leading-tight text-[var(--color-text)]">
								THE NIGHTINGAMES
							</h1>
						</div>
					</Link>
					<button
						onClick={closeSidebar}
						className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] lg:hidden"
						aria-label="Close sidebar"
					>
						<X size={20} />
					</button>
				</div>

				{availableYears.length > 0 && (
					<>
						<div className="mb-4">
							<Label htmlFor="year-filter">Year</Label>
							<Select
								id="year-filter"
								icon={CalendarRange}
								value={selectedYear ?? "all"}
								onChange={(e) =>
									setSelectedYear(e.target.value === "all" ? null : Number(e.target.value))
								}
							>
								<option value="all">All Years</option>
								{availableYears.map((year) => (
									<option key={year} value={year}>
										{year}
									</option>
								))}
							</Select>
						</div>
						<div className="mb-4 border-t border-[var(--color-border)]" />
					</>
				)}

				<nav className="flex flex-col gap-1">
					{navItems.map(({ to, label, icon: Icon }) => (
						<NavLink
							key={to}
							to={to}
							className={({ isActive }) =>
								`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
									isActive
										? "bg-[var(--color-primary)] text-[var(--color-primary-contrast)]"
										: "text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-text)]"
								}`
							}
							onClick={closeSidebar}
						>
							<Icon size={16} />
							{label}
						</NavLink>
					))}
				</nav>

				<div className="mt-auto flex flex-col gap-3 border-t border-[var(--color-border)] pt-4">
					<SegmentedControl value={theme} onChange={updateTheme} options={themeOptions} />
					{user ? (
						<Button onClick={handleLogoutClick} variant="secondary" size="md">
							<LogOut size={16} />
							Logout
						</Button>
					) : (
						<Button onClick={handleLoginClick} variant="secondary" size="md">
							<LogIn size={16} />
							Login
						</Button>
					)}
				</div>
			</aside>
		</>
	);
};
