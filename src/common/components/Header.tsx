import { Menu } from "lucide-react";
import { useUI } from "common/context/UIContext";

export const Header: React.FC = () => {
	const { toggleSidebar } = useUI();

	return (
		<header className="flex items-center justify-between border-b border-gray-800 bg-[var(--color-surface)] px-4 py-3 sm:hidden">
			{/* Logo (mobile only) */}
			<div className="flex items-center gap-3">
				<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-lg font-bold text-[var(--color-primary-contrast)]">
					🎲
				</div>
				<div>
					<h1 className="text-base leading-tight font-medium text-[var(--color-primary)]">Game Tracker</h1>
					<p className="text-[10px] text-gray-500">v1.0</p>
				</div>
			</div>

			<button onClick={toggleSidebar} className="text-gray-400 hover:text-white" aria-label="Open menu">
				<Menu size={24} />
			</button>
		</header>
	);
};
