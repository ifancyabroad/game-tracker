import { Menu, Sun, Moon } from "lucide-react";
import { Link } from "react-router";
import { useUI } from "common/context/UIContext";
import logo from "assets/logo.svg";

export const Header: React.FC = () => {
	const { openSidebar, theme, toggleTheme } = useUI();

	return (
		<header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 lg:hidden">
			<Link to="/" className="flex items-center gap-2.5">
				<div className="flex h-9 w-9 items-center justify-center">
					<img src={logo} alt="Logo" />
				</div>
				<h1 className="font-display text-base text-[var(--color-text)]">THE NIGHTINGAMES</h1>
			</Link>
			<div className="flex items-center gap-1">
				<button
					onClick={toggleTheme}
					className="rounded-lg p-2 text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg)]"
					aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
				>
					{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
				</button>
				<button
					onClick={openSidebar}
					className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
					aria-label="Open menu"
				>
					<Menu size={20} />
				</button>
			</div>
		</header>
	);
};
