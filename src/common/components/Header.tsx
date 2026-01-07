import { Menu } from "lucide-react";
import { Link } from "react-router";
import { useUI } from "common/context/UIContext";
import { AppBranding } from "common/components/AppBranding";

export const Header: React.FC = () => {
	const { openSidebar } = useUI();

	return (
		<header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 lg:hidden">
			<Link to="/">
				<AppBranding />
			</Link>
			<div className="flex items-center gap-1">
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
