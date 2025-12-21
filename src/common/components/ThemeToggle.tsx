import { Moon, Sun } from "lucide-react";
import { useUI } from "common/context/UIContext";

export const ThemeToggle: React.FC = () => {
	const { theme, toggleTheme } = useUI();

	return (
		<button
			onClick={toggleTheme}
			className="rounded-lg p-2 text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg)]"
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
			title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
		>
			{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
		</button>
	);
};
