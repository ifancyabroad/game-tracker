import { Menu } from "lucide-react";
import { useUI } from "common/context/UIContext";
import logo from "assets/logo.svg";

export const Header: React.FC = () => {
	const { openSidebar } = useUI();

	return (
		<header className="flex items-center justify-between border-b border-gray-700 bg-[var(--color-surface)] px-4 py-2.5 sm:hidden">
			<div className="flex items-center gap-2.5">
				<div className="flex h-9 w-9 items-center justify-center">
					<img src={logo} alt="Logo" />
				</div>
				<h1 className="text-base font-bold text-white">THE NIGHTINGAMES</h1>
			</div>
			<button onClick={openSidebar} className="text-gray-400 hover:text-white" aria-label="Open menu">
				<Menu size={20} />
			</button>
		</header>
	);
};
