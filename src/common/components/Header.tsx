import { Menu } from "lucide-react";
import { useUI } from "common/context/UIContext";

export const Header: React.FC = () => {
	const { openSidebar } = useUI();

	return (
		<header className="flex items-center justify-between border-b border-gray-700 bg-[var(--color-surface)] px-4 py-3 sm:hidden">
			<div className="flex items-center gap-3">
				<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-lg font-bold text-[var(--color-primary-contrast)]">
					🎲
				</div>
				<h1 className="text-base font-semibold text-white">Game Tracker</h1>
			</div>
			<button onClick={openSidebar} className="text-gray-400 hover:text-white" aria-label="Open menu">
				<Menu size={20} />
			</button>
		</header>
	);
};
