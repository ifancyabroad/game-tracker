import { Menu } from "lucide-react";
import { Link } from "react-router";
import { useUI } from "common/context/UIContext";
import { ThemeToggle } from "common/components";
import logo from "assets/logo.svg";

export const Header: React.FC = () => {
	const { openSidebar } = useUI();

	return (
		<header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 sm:hidden">
			<Link to="/" className="flex items-center gap-2.5">
				<div className="flex h-9 w-9 items-center justify-center">
					<img src={logo} alt="Logo" />
				</div>
				<h1 className="text-base font-bold text-[var(--color-text)]">THE NIGHTINGAMES</h1>
			</Link>
			<div className="flex items-center gap-1">
				<ThemeToggle />
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
